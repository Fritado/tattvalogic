const User = require('../models/User');

/**
 * Returns an array of User ObjectIds that report (directly or indirectly)
 * to the specified userId.
 *
 * @param {String|ObjectId} userId The ID of the manager
 * @returns {Promise<Array<ObjectId>>} List of reportee ObjectIds
 */
const getHierarchyUserIds = async (userId) => {
    // We'll do a simple BFS traversal
    const allUsers = await User.find({ isActive: true }).select('_id reportingManager');
    
    // Build an adjacency list (managerId -> array of reporteeIds)
    const reporteesMap = {};
    for (const u of allUsers) {
        if (u.reportingManager) {
            const mgrId = u.reportingManager.toString();
            if (!reporteesMap[mgrId]) reporteesMap[mgrId] = [];
            reporteesMap[mgrId].push(u._id);
        }
    }

    const reporteesIds = [];
    const queue = [userId.toString()];

    while (queue.length > 0) {
        const currentId = queue.shift();
        const directReportees = reporteesMap[currentId] || [];
        
        for (const reporteeId of directReportees) {
            reporteesIds.push(reporteeId);
            queue.push(reporteeId.toString());
        }
    }

    return reporteesIds;
};

module.exports = { getHierarchyUserIds };
