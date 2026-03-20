const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');

// Load env vars from one level up (backend/.env)
dotenv.config({ path: '../.env' });

const seedBlogPost = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const blogData = {
            title: "Architecting Scalable Microservices with Next.js and Node.js",
            slug: "architecting-scalable-microservices",
            excerpt: "A deep dive into building resilient, high-performance distributed systems using modern JavaScript frameworks and cloud-native patterns.",
            content: `
                <h2 id="the-shift-to-microservices-0">The Shift to Microservices</h2>
                <p>In the rapidly evolving landscape of software development, the monolithic approach is often replaced by microservices for its flexibility and scalability. This transition, however, brings its own set of challenges, particularly in orchestration and data consistency.</p>
                <h2 id="why-nextjs-as-a-frontend-orchestrator-1">Why Next.js as a Frontend Orchestrator?</h2>
                <p>Next.js isn't just a React framework; it's a powerful tool for server-side rendering (SSR) and Incremental Static Regeneration (ISR). When paired with a robust Node.js backend, it can efficiently handle dynamic content and SEO requirements while maintaining low latency.</p>
                <blockquote class="border-primary bg-white/5 py-2 px-8 rounded-2xl font-serif italic text-white/70">
                    "Scalability is not about building for a million users today; it's about building a system that won't break when you reach that million."
                </blockquote>
                <h2 id="database-patterns-for-distributed-systems-2">Database Patterns for Distributed Systems</h2>
                <p>Using MongoDB Atlas provides the flexibility needed for microservices. With its horizontal scaling capabilities and global clusters, it ensures that data is close to the user, reducing latency and improving the overall user experience.</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Eventual Consistency:</strong> Embracing asynchronous communication.</li>
                    <li><strong>API Gateway:</strong> Centralizing entry points for security and routing.</li>
                    <li><strong>Service Discovery:</strong> Managing dynamic service instances.</li>
                </ul>
                <h3 id="implementing-json-ld-for-advanced-seo-3">Implementing JSON-LD for Advanced SEO</h3>
                <p>Structured data helps search engines understand the context of your content. By embedding JSON-LD, we ensure that our technical insights reach the right audience through rich snippets in search results.</p>
            `,
            category: "Engineering",
            tags: ["Architecture", "NextJS", "Microservices", "SEO"],
            author: "TattvaLogic Engineering",
            isPublished: true,
            featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop", 
            seoTitle: "Scalable Microservices Architecture with Next.js | TattvaLogic",
            metaDescription: "Learn how TattvaLogic architects scalable microservices using Next.js, Node.js, and MongoDB Atlas for high-performance enterprise applications.",
            focusKeywords: ["Microservices", "Scalability", "Next.js Architecture"]
        };

        const existing = await Blog.findOne({ slug: blogData.slug });
        if (existing) {
            await Blog.findByIdAndUpdate(existing._id, blogData);
            console.log('Updated existing seed blog post.');
        } else {
            await Blog.create(blogData);
            console.log('Created new seed blog post.');
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedBlogPost();
