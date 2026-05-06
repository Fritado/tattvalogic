const Testimonial = require('../../models/Testimonial');

// @desc    Get all testimonials (Public)
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true })
            .sort('displayOrder');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all testimonials for admin
// @route   GET /api/testimonials/admin
// @access  Private
exports.getAdminTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort('displayOrder');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = async (req, res) => {
    try {
        const testimonialData = { ...req.body };
        
        if (req.file) {
            testimonialData.clientImage = `/uploads/${req.file.filename}`;
        }

        const testimonial = await Testimonial.create(testimonialData);
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonialData = { ...req.body };

        if (req.file) {
            testimonialData.clientImage = `/uploads/${req.file.filename}`;
        }

        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, testimonialData, { new: true });
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
        res.json({ message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder testimonials
// @route   PUT /api/testimonials/reorder
// @access  Private
exports.reorderTestimonials = async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, displayOrder }
        const updatePromises = items.map(item => 
            Testimonial.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
        );
        await Promise.all(updatePromises);
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
