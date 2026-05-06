const Holiday = require('./holidayModel');

exports.getHolidays = async (req, res) => {
  try {
    const { year } = req.query;
    let query = { isDeleted: false, status: 'active' };
    
    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      query.date = { $gte: start, $lte: end };
    }

    const holidays = await Holiday.find(query).sort({ date: 1 });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createHoliday = async (req, res) => {
  try {
    const holiday = new Holiday({
      ...req.body,
      createdBy: req.user._id
    });
    await holiday.save();
    res.status(201).json(holiday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });
    res.json(holiday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true }
    );
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });
    res.json({ message: "Holiday deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
