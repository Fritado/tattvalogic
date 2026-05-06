const Portfolio = require('../../models/Portfolio');

// Helper: Generate slug
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// @desc    Get all portfolio items (Public)
// @route   GET /api/portfolio
// @access  Public
exports.getPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ status: 'active' })
            .sort('displayOrder');
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all portfolio items for admin
// @route   GET /api/portfolio/admin
// @access  Private
exports.getAdminPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort('displayOrder');
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create portfolio item
// @route   POST /api/portfolio
// @access  Private
exports.createPortfolio = async (req, res) => {
    try {
        const portfolioData = { ...req.body };
        
        if (!portfolioData.slug && portfolioData.title) {
            portfolioData.slug = slugify(portfolioData.title);
        }

        // Parse technologies if sent as string
        if (typeof portfolioData.technologies === 'string') {
            portfolioData.technologies = portfolioData.technologies.split(',').map(t => t.trim());
        }

        // Handle thumbnail upload if using multer (future enhancement)
        if (req.file) {
            portfolioData.thumbnail = `/uploads/${req.file.filename}`;
        }

        const portfolio = await Portfolio.create(portfolioData);
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
exports.updatePortfolio = async (req, res) => {
    try {
        const portfolioData = { ...req.body };

        if (portfolioData.title && !portfolioData.slug) {
            portfolioData.slug = slugify(portfolioData.title);
        }

        if (typeof portfolioData.technologies === 'string') {
            portfolioData.technologies = portfolioData.technologies.split(',').map(t => t.trim());
        }

        if (req.file) {
            portfolioData.thumbnail = `/uploads/${req.file.filename}`;
        }

        const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, portfolioData, { new: true });
        if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' });
        res.json(portfolio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
exports.deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
        if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' });
        res.json({ message: 'Portfolio item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder portfolio items
// @route   PUT /api/portfolio/reorder
// @access  Private
exports.reorderPortfolio = async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, displayOrder }
        const updatePromises = items.map(item => 
            Portfolio.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
        );
        await Promise.all(updatePromises);
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
