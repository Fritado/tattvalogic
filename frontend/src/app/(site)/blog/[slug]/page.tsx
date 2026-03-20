import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

import { API_BASE } from "@/config/apiConfig";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await fetch(`${API_BASE}/blogs/${slug}`);
        if (!res.ok) return { title: "Post Not Found" };
        const post = await res.json();
        
        return {
            title: post.seoTitle || `${post.title} | TattvaLogic Blog`,
            description: post.metaDescription || post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: post.featuredImage ? [{ url: new URL(post.featuredImage, "https://tattvalogic.com").toString() }] : [],
            }
        };
    } catch (err) {
        return { title: "Blog | TattvaLogic" };
    }
}

async function getBlogPost(slug: string) {
    const res = await fetch(`${API_BASE}/blogs/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
}

async function getRelatedPosts(category: string, currentId: string) {
    const res = await fetch(`${API_BASE}/blogs?category=${category}&limit=3`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.blogs || []).filter((b: any) => b._id !== currentId);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(post.category, post._id);

    return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
