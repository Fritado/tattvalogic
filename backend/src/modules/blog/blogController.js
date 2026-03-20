const Blog = require('../../models/Blog');

// @desc    Get all blogs (Public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
    try {
        const { category, tag, search, page = 1, limit = 10 } = req.query;
        const query = { isPublished: true };

        if (category) query.category = category;
        if (tag) query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .sort('-publishDate')
            .skip(skip)
            .limit(Number(limit));

        res.json({
            blogs,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all blogs for admin
// @route   GET /api/blogs/admin
// @access  Private
exports.getAdminBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort('-createdAt');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper: Generate slug
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
    try {
        const blogData = { ...req.body };
        
        // Handle featured image upload
        if (req.file) {
            blogData.featuredImage = `/uploads/${req.file.filename}`;
        }

        if (!blogData.slug && blogData.title) {
            blogData.slug = slugify(blogData.title);
        }

        // Parse tags and keywords if sent as string (from FormData)
        if (typeof blogData.tags === 'string') {
            blogData.tags = blogData.tags.split(',').map(tag => tag.trim());
        }
        if (typeof blogData.focusKeywords === 'string') {
            blogData.focusKeywords = blogData.focusKeywords.split(',').map(k => k.trim());
        }

        const blog = await Blog.create(blogData);
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
    try {
        const blogData = { ...req.body };

        // Handle featured image upload
        if (req.file) {
            blogData.featuredImage = `/uploads/${req.file.filename}`;
        }

        if (blogData.title && !blogData.slug) {
            blogData.slug = slugify(blogData.title);
        }

        // Parse tags and keywords if sent as string
        if (typeof blogData.tags === 'string') {
            blogData.tags = blogData.tags.split(',').map(tag => tag.trim());
        }
        if (typeof blogData.focusKeywords === 'string') {
            blogData.focusKeywords = blogData.focusKeywords.split(',').map(k => k.trim());
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, blogData, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
