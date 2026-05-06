const Team = require('../../models/Team');

// @desc    Get all active team members (Public)
// @route   GET /api/team
// @access  Public
exports.getTeam = async (req, res) => {
    try {
        const team = await Team.find({ isActive: true }).sort('order');
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all team members for admin
// @route   GET /api/team/admin
// @access  Private
exports.getAdminTeam = async (req, res) => {
    try {
        const team = await Team.find().sort('order');
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private
exports.createMember = async (req, res) => {
    try {
        const memberData = { ...req.body };
        
        // Handle boolean and number conversion from FormData
        if (memberData.isActive !== undefined) {
            memberData.isActive = memberData.isActive === 'true';
        }
        if (memberData.order !== undefined) {
            memberData.order = Number(memberData.order);
        }

        // Handle profile image upload
        if (req.file) {
            memberData.image = `/uploads/${req.file.filename}`;
        }

        const member = await Team.create(memberData);
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
exports.updateMember = async (req, res) => {
    try {
        const memberData = { ...req.body };

        // Handle boolean and number conversion from FormData
        if (memberData.isActive !== undefined) {
            memberData.isActive = memberData.isActive === 'true';
        }
        if (memberData.order !== undefined) {
            memberData.order = Number(memberData.order);
        }

        // Handle profile image upload
        if (req.file) {
            memberData.image = `/uploads/${req.file.filename}`;
        }

        const member = await Team.findByIdAndUpdate(req.params.id, memberData, { new: true });
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
exports.deleteMember = async (req, res) => {
    try {
        const member = await Team.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: 'Team member not found' });
        res.json({ message: 'Team member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
