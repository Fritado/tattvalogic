const express = require('express');
const router = express.Router();
const { 
    getEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee,
    getProfile,
    getEmployeeById
} = require('./employeeController');
const { protect } = require('../../middleware/auth');

router.get('/profile', protect, getProfile);

// Admin only routes
router.get('/', protect, getEmployees);
router.post('/', protect, createEmployee);
router.get('/:id', protect, getEmployeeById);
router.get('/:id/onboarding', protect, getEmployeeById);
router.put('/:id', protect, updateEmployee);
router.put('/:id/onboarding', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
