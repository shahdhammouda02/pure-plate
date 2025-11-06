"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useSession } from "next-auth/react";

import hero3 from "@/public/images/herobg.png";
import hero2 from "@/public/images/Hero_food.png";
import hero from "@/public/images/hero3.png";
import missionImage from "@/public/images/Lucid_Origin_Healthy_food_meal_planning_concept_fresh_vegetabl_2.jpg";
import {
  Leaf,
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  insightStats,
  successStories,
  nutritionTips,
  researchReports,
  userProgressData,
} from "@/data/insights_data";
import { useState } from "react";

export default function HomePage() {
  const { data: session } = useSession();

  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    if (session) {
      router.push("/planner");
    } else {
      router.push("/auth/signin");
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    successStories: false,
    nutritionTips: false,
    researchReports: false,
    progressTrends: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full">
      {/* Hero Section with Carousel */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-16 md:py-20">
        {/* Carousel for Hero Images */}
        <div className="absolute inset-0 -z-10">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
            opts={{
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent>
              {[hero, hero2, hero3].map((img, index) => (
                <CarouselItem key={index} className="relative w-full h-screen">
                  <Image
                    src={img}
                    alt={`Hero image ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-in-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center px-4 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg hover:scale-105 transition-transform duration-300">
            PurePlate
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md hover:text-white transition-colors duration-300">
            AI-powered Healthy Meal & Nutrition Planner
          </p>
          <p className="text-base md:text-lg text-white/80 max-w-lg drop-shadow-sm hover:text-white/90 transition-colors duration-300">
            Eat smart. Feel better. Get personalized meal plans for your goals.
          </p>
          <Button
            size="lg"
            className="bg-green-50 hover:bg-green-100 hover:scale-105 hover:shadow-xl text-green-700 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg cursor-pointer transition-all duration-300"
            onClick={handleClick}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* What is PurePlate Section */}
      <section className="w-full py-20 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 hover:text-green-700 transition-colors duration-300">
              What is PurePlate?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
              PurePlate is your intelligent nutrition companion that transforms
              how you approach healthy eating. Using advanced AI technology, we
              create personalized meal plans tailored to your unique dietary
              needs, preferences, and health goals. Whether you are managing
              weight, building muscle, or simply wanting to eat better,
              PurePlate makes healthy eating simple, sustainable, and delicious.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="relative w-full py-20 sm:py-16 md:py-20 overflow-hidden bg-green-50/40">
        {/* Image on the Right — full height and attached to right edge */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 lg:block hidden sm:hidden">
          <Image
            src={missionImage}
            alt="Our Mission - Healthy eating and nutrition"
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="flex flex-col justify-center space-y-6 z-10 p-6 lg:p-8 lg:pl-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 sm:text-2xl hover:text-green-700 transition-colors duration-300">
                Our Mission
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed sm:text-base hover:text-gray-900 transition-colors duration-300">
                We believe everyone deserves access to personalized nutrition
                that fits their lifestyle. Our goal is to eliminate the
                guesswork from healthy eating by providing science-backed,
                AI-driven meal planning that adapts to your changing needs.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed sm:text-base hover:text-gray-900 transition-colors duration-300">
                We are committed to making nutrition education accessible and
                meal preparation practical for everyone, empowering you to take
                control of your health journey with confidence and ease.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Personalized nutrition plans",
                  "Science-backed recommendations",
                  "Adaptive meal planning",
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="w-2 h-2 bg-green-600 rounded-full group-hover:scale-150 group-hover:bg-green-700 transition-all duration-300"></div>
                    <span className="text-gray-700 sm:text-sm group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Image */}
            <div className="w-full h-64 relative lg:hidden sm:block mt-8">
              <Image
                src={missionImage}
                alt="Our Mission - Healthy eating and nutrition"
                fill
                className="object-cover object-center rounded-lg hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem We Solve Section */}
      <section className="w-full py-20 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center hover:text-green-700 transition-colors duration-300">
              The Problem We Solve
            </h2>

            <div className="mb-8">
              <p className="text-lg md:text-xl text-gray-700 mb-6 text-center hover:text-gray-900 transition-colors duration-300">
                Most people struggle with maintaining a healthy diet because of:
              </p>

              {/* FIX: use items-center on ul but remove justify-center on li */}
              <ul className="text-lg text-gray-700 space-y-5 flex flex-col items-center">
                {[
                  "Overwhelming nutrition information and conflicting advice",
                  "Time-consuming meal planning and grocery shopping",
                  "One-size-fits-all diet plans that do not account for individual needs",
                  "Difficulty tracking nutritional intake and progress",
                  "Lack of personalized support for specific health conditions",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-3 text-left max-w-xl w-full group hover:bg-green-50 p-3 rounded-lg transition-all duration-300"
                  >
                    <Leaf
                      className="w-6 h-6 text-green-600 shrink-0 mt-1 group-hover:scale-125 group-hover:text-green-700 transition-all duration-300"
                      strokeWidth={2}
                    />
                    <span className="block group-hover:text-gray-900 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center hover:bg-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold text-green-800 mb-3 hover:text-green-900 transition-colors duration-300">
                PurePlate Solution
              </h3>
              <p className="text-lg text-green-700 hover:text-green-800 transition-colors duration-300">
                PurePlate solves these challenges by delivering customized meal
                plans, automated grocery lists, and continuous nutritional
                guidance right at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section - Directly written here */}
      <section className="w-full py-20 bg-linear-to-br from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 hover:text-green-700 transition-colors duration-300">
                Data-Driven Insights & Success Stories
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto hover:text-gray-800 transition-colors duration-300">
                Discover real results, evidence-based research, and smart
                nutrition strategies backed by AI analysis
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {insightStats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-lg shadow-sm border hover:shadow-lg hover:scale-105 hover:border-green-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-2xl md:text-3xl font-bold text-green-700 mb-2 hover:text-green-800 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium hover:text-gray-800 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Success Stories */}
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-700 hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors duration-300">
                      Success Stories
                    </h3>
                  </div>
                </div>
                <div className="space-y-6">
                  {successStories
                    .slice(
                      0,
                      expandedSections.successStories
                        ? successStories.length
                        : 2
                    )
                    .map((story, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-green-500 pl-4 py-2 hover:border-green-700 hover:bg-green-50 rounded-r-lg transition-all duration-300 group"
                      >
                        <div className="font-semibold text-gray-800 text-lg group-hover:text-gray-900 transition-colors duration-300">
                          {story.name}
                        </div>
                        <div className="text-green-700 text-sm font-medium mb-2 group-hover:text-green-800 transition-colors duration-300">
                          {story.achievement}
                        </div>
                        <div className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                          {story.story}
                        </div>
                      </div>
                    ))}
                </div>
                {successStories.length > 2 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-700 border-green-700 hover:bg-green-700 hover:text-white hover:scale-105 transition-all duration-300"
                      onClick={() => toggleSection("successStories")}
                    >
                      {expandedSections.successStories ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          View Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View More Stories
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Smart Nutrition Tips */}
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-green-700 hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors duration-300">
                      Smart Nutrition Tips
                    </h3>
                  </div>
                </div>
                <div className="grid gap-4">
                  {nutritionTips
                    .slice(
                      0,
                      expandedSections.nutritionTips ? nutritionTips.length : 3
                    )
                    .map((tip) => (
                      <div
                        key={tip.id}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 hover:scale-105 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 shrink-0 group-hover:scale-150 group-hover:bg-green-600 transition-all duration-300"></div>
                        <div>
                          <span className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                            {tip.tip}
                          </span>
                          <div className="text-xs text-green-700 font-medium mt-1 group-hover:text-green-800 transition-colors duration-300">
                            {tip.category}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {nutritionTips.length > 3 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-700 border-green-700 hover:bg-green-700 hover:text-white hover:scale-105 transition-all duration-300"
                      onClick={() => toggleSection("nutritionTips")}
                    >
                      {expandedSections.nutritionTips ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          View Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View More Tips
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Research & Progress Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Evidence-Based Research */}
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-green-700 hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors duration-300">
                      Evidence-Based Research
                    </h3>
                  </div>
                </div>
                <div className="space-y-6">
                  {researchReports
                    .slice(
                      0,
                      expandedSections.researchReports
                        ? researchReports.length
                        : 2
                    )
                    .map((report, index) => (
                      <div
                        key={index}
                        className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0 hover:bg-green-50 hover:rounded-lg hover:p-3 transition-all duration-300 group"
                      >
                        <div className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                          {report.title}
                        </div>
                        <div className="text-gray-600 text-sm mb-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                          {report.summary}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          Source: {report.source}
                        </div>
                      </div>
                    ))}
                </div>
                {researchReports.length > 2 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-700 border-green-700 hover:bg-green-700 hover:text-white hover:scale-105 transition-all duration-300"
                      onClick={() => toggleSection("researchReports")}
                    >
                      {expandedSections.researchReports ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          View Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View More Research
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* User Progress Trends */}
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-700 hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors duration-300">
                      User Progress Trends
                    </h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {userProgressData
                    .slice(
                      0,
                      expandedSections.progressTrends
                        ? userProgressData.length
                        : 3
                    )
                    .map((progress, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 hover:scale-105 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div>
                          <div className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                            {progress.period}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            {progress.metric}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-700 group-hover:text-green-800 group-hover:scale-110 transition-all duration-300">
                          {progress.improvement}
                        </div>
                      </div>
                    ))}
                </div>
                {userProgressData.length > 3 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-700 border-green-700 hover:bg-green-700 hover:text-white hover:scale-105 transition-all duration-300"
                      onClick={() => toggleSection("progressTrends")}
                    >
                      {expandedSections.progressTrends ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          View Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View More Trends
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 sm:py-16 md:py-20 bg-gray-700">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 hover:text-green-100 transition-colors duration-300">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="text-lg text-gray-300 mb-8 hover:text-white transition-colors duration-300">
              Join thousands of users who have achieved their health goals with
              PurePlate
            </p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-xl text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg cursor-pointer transition-all duration-300"
              onClick={handleClick}
            >
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}