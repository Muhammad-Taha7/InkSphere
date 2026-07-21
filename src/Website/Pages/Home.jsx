import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import JourneyComponent from '../Components/JourneyComponent';
import LatestBlogs from '../Components/LatestBlogs';

export const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] w-full overflow-hidden bg-white px-6 py-20 text-gray-900 md:px-12 lg:px-20 flex flex-col justify-center">

                <div className="relative z-10 mx-auto max-w-[1600px] w-full">
                    
                    {/* Header Row */}
                    <div className="mb-16 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="flex items-center gap-2 rounded-full border border-yellow-400 bg-yellow-50 px-4 py-1.5">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">Discover InkSphere</span>
                        </div>

                        <h1 className="max-w-5xl font-serif text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-7xl lg:text-[7rem]">
                            Stories That <span className="text-yellow-500">Inspire</span> <br/>
                            Ideas That <span className="italic font-light">Matter</span>.
                        </h1>
                        
                        <p className="mt-4 max-w-2xl text-lg text-gray-500 md:text-xl">
                            Join a global community of writers and readers exploring the intersections of technology, culture, and human experience.
                        </p>
                    </div>

                    {/* Featured Layout */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:h-[600px]">
                        
                        {/* Main Featured Image */}
                        <div className="group relative col-span-1 h-[400px] overflow-hidden rounded-2xl lg:col-span-8 lg:h-full">
                            <img
                                src="https://static.wixstatic.com/media/c837a6_bef2c08801ac476085e150139fc1aea4~mv2.jpg/v1/fill/w_482,h_468,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_auto/8796233c-40e9-4a45-aafc-c9e3c339cba9.jpg"
                                alt="Writer at work"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            
                            <div className="absolute bottom-8 left-8 right-8">
                                <span className="mb-3 inline-block rounded bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">Featured</span>
                                <h2 className="font-serif text-3xl font-bold text-white md:text-5xl lg:max-w-2xl">
                                    The Art of Finding Your Voice in a Digital Age
                                </h2>
                            </div>
                        </div>

                        {/* Call to Action Box */}
                        <div className="col-span-1 flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-8 lg:col-span-4 lg:p-12 transition-colors hover:border-yellow-400">
                            
                            <div>
                                <div className="mb-6 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <h3 className="mb-4 font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                                    Start Your Journey
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Create a free account to start publishing your own stories, connecting with readers, and building your audience.
                                </p>
                            </div>

                            <div className="mt-12 space-y-4">
                                <Link to="/auth" className="flex w-full items-center justify-between rounded-xl bg-yellow-400 px-6 py-4 text-sm font-bold text-black transition-all hover:bg-yellow-500 group">
                                    <span>START WRITING</span>
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link to="/blogs" className="block w-full rounded-xl border border-gray-300 bg-transparent px-6 py-4 text-center text-sm font-bold text-gray-900 transition-all hover:bg-gray-100">
                                    EXPLORE ARTICLES
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            
            {/* Other Sections */}
            <JourneyComponent />
            <LatestBlogs />
        </div>
    );
};

export default Home;