const LeaveRequest = require('./leaveRequestModel');
const LeavePolicy = require('./leavePolicyModel');
const LeaveBalance = require('./leaveBalanceModel');
const User = require('../../models/User');

exports.applyLeave = async (req, res) => {
  try {
    // Admin cannot apply for leave
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: "Administrators cannot apply for leave. Admin role is for management only." });
    }

    const { leaveType, fromDate, toDate, reason } = req.body;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check for overlapping leaves
    const overlap = await LeaveRequest.findOne({
      userId: req.user._id,
      status: { $ne: 'Rejected' },
      isDeleted: false,
      $or: [{ fromDate: { $lte: end }, toDate: { $gte: start } }]
    });

    if (overlap) {
      return res.status(400).json({ message: "You already have a leave request for these dates." });
    }

    const leaveRequest = new LeaveRequest({
      userId: req.user._id,
      leaveType,
      fromDate: start,
      toDate: end,
      totalDays,
      reason
    });

    await leaveRequest.save();

    // Update Pending Balance
    const year = start.getFullYear();
    const typeMap = {
      'Bereavement Leave': 'bereavementPending',
      'Sick Leave': 'sickPending',
      'Privilege Leave': 'privilegePending',
      'Optional Holiday': 'optionalPending'
    };
    
    const field = typeMap[leaveType];
    if (field) {
      await LeaveBalance.findOneAndUpdate(
        { userId: req.user._id, year },
        { $inc: { [field]: totalDays } },
        { upsert: true }
      );
    }

    res.status(201).json(leaveRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ 
      userId: req.user._id, 
      isDeleted: false 
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status, userId } = req.query;
    let query = { isDeleted: false };
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const requests = await LeaveRequest.find(query)
      .populate('userId', 'email employeeRef role department')
      .populate('approvedBy', 'email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    if (leave.status !== 'Pending') return res.status(400).json({ message: "Leave already processed" });

    leave.status = 'Approved';
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    await leave.save();

    // Update Leave Balance: move from Pending to Used
    const year = new Date(leave.fromDate).getFullYear();
    const typeMap = {
      'Bereavement Leave': ['bereavementPending', 'bereavementUsed'],
      'Sick Leave': ['sickPending', 'sickUsed'],
      'Privilege Leave': ['privilegePending', 'privilegeUsed'],
      'Optional Holiday': ['optionalPending', 'optionalUsed']
    };
    
    const fields = typeMap[leave.leaveType];
    if (fields) {
      await LeaveBalance.findOneAndUpdate(
        { userId: leave.userId, year },
        { 
          $inc: { 
            [fields[0]]: -leave.totalDays,
            [fields[1]]: leave.totalDays 
          } 
        }
      );
    }

    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    if (leave.status !== 'Pending') return res.status(400).json({ message: "Leave already processed" });

    leave.status = 'Rejected';
    leave.rejectionReason = rejectionReason;
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    await leave.save();

    // Update Leave Balance: decrease Pending
    const year = new Date(leave.fromDate).getFullYear();
    const typeMap = {
      'Bereavement Leave': 'bereavementPending',
      'Sick Leave': 'sickPending',
      'Privilege Leave': 'privilegePending',
      'Optional Holiday': 'optionalPending'
    };
    
    const field = typeMap[leave.leaveType];
    if (field) {
      await LeaveBalance.findOneAndUpdate(
        { userId: leave.userId, year },
        { $inc: { [field]: -leave.totalDays } }
      );
    }

    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.withdrawLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findOne({ _id: req.params.id, userId: req.user._id });
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    if (leave.status !== 'Pending') return res.status(400).json({ message: "Only pending leaves can be withdrawn" });

    leave.status = 'Withdrawn';
    await leave.save();

    // Update Leave Balance: decrease Pending
    const year = new Date(leave.fromDate).getFullYear();
    const typeMap = {
      'Bereavement Leave': 'bereavementPending',
      'Sick Leave': 'sickPending',
      'Privilege Leave': 'privilegePending',
      'Optional Holiday': 'optionalPending'
    };
    
    const field = typeMap[leave.leaveType];
    if (field) {
      await LeaveBalance.findOneAndUpdate(
        { userId: leave.userId, year },
        { $inc: { [field]: -leave.totalDays } }
      );
    }

    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const userId = req.query.userId || req.user._id;

    let balance = await LeaveBalance.findOne({ userId, year });
    
    // If no balance exists, try to get policy and create a default balance
    if (!balance) {
      const policy = await LeavePolicy.findOne({ year, isDeleted: false }) || {
        bereavementLeave: 5, sickLeave: 8, privilegeLeave: 15
      };
      
      balance = {
        bereavementAllocated: policy.bereavementLeave,
        bereavementUsed: 0,
        bereavementPending: 0,
        sickAllocated: policy.sickLeave,
        sickUsed: 0,
        sickPending: 0,
        privilegeAllocated: policy.privilegeLeave,
        privilegeUsed: 0,
        privilegePending: 0,
        optionalAllocated: 2,
        optionalUsed: 0,
        optionalPending: 0
      };
    }

    res.json(balance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upsertPolicy = async (req, res) => {
  try {
    const { year } = req.body;
    const policy = await LeavePolicy.findOneAndUpdate(
      { year, isDeleted: false },
      req.body,
      { new: true, upsert: true }
    );
    res.json(policy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
