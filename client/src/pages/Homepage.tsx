

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  ArrowRight,
  Package,
  Coffee,
  Droplets,
  Wind,
} from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-50 relative overflow-hidden">
        {/* Soft Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-blue-200 opacity-40 animate-pulse">
            <Cloud className="h-32 w-32 transform rotate-12" />
          </div>
          <div className="absolute top-1/3 right-20 text-slate-200 opacity-35 animate-bounce">
            <Coffee className="h-24 w-24 transform -rotate-12" />
          </div>
          <div className="absolute bottom-20 left-1/4 text-gray-200 opacity-30 animate-pulse">
            <Droplets className="h-40 w-40 transform rotate-6" />
          </div>
          <div className="absolute bottom-1/3 right-1/3 text-blue-200 opacity-40 animate-bounce">
            <Wind className="h-28 w-28 transform -rotate-15" />
          </div>
          {/* Additional floating elements */}
          <div className="absolute top-1/4 left-1/3 text-slate-300 opacity-50 animate-ping">
            <Cloud className="h-8 w-8" />
          </div>
          <div className="absolute top-2/3 left-1/2 text-blue-300 opacity-45 animate-pulse">
            <Coffee className="h-12 w-12" />
          </div>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-slate-100/95 to-blue-100/95 backdrop-blur-md shadow-lg border-b border-slate-200/50 relative z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-slate-500 to-blue-600 p-2 rounded-xl shadow-md animate-pulse">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-800 bg-clip-text text-transparent">
                  Roastea Sweets
                </h1>
              </div>
              <button
                onClick={() => navigate("/inventory")}
                className="bg-gradient-to-r from-slate-500 to-blue-600 hover:from-slate-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-slate-300/30 transition-all duration-300 px-4 py-2 rounded-lg flex items-center font-medium"
              >
                <Package className="h-4 w-4 mr-2" />
                View Inventory
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6 relative z-10">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Cloud className="h-16 w-16 text-slate-500 mr-4 animate-pulse" />
                <h2 className="text-6xl font-bold text-slate-800 leading-tight">
                  Roastea
                  <span className="bg-gradient-to-r from-blue-600 via-slate-600 to-gray-700 bg-clip-text text-transparent">
                    {" "}
                    Sweets
                  </span>
                </h2>
                <Coffee className="h-12 w-12 text-blue-600 ml-4 transform rotate-12 animate-bounce" />
              </div>
              <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
                Where morning mist meets afternoon coffee in perfect harmony. Our 
                artisanal treats are crafted with the serenity of cloudy skies and 
                the comfort of your favorite café, bringing tranquil sweetness to every moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/inventory")}
                  className="bg-gradient-to-r from-slate-600 via-blue-600 to-gray-700 hover:from-slate-700 hover:via-blue-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl hover:shadow-slate-400/40 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 rounded-lg flex items-center justify-center font-semibold"
                >
                  <Cloud className="h-5 w-5 mr-2" />
                  Explore Our sweet crafts
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Droplets className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-4xl font-bold text-slate-800">
                  Serene Excellence
                </h3>
                <Coffee className="h-8 w-8 text-slate-600 ml-3" />
              </div>
              <p className="text-slate-700 max-w-2xl mx-auto">
                Our commitment to tranquil flavors and artisanal café craftsmanship
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-slate-100/90 to-blue-100/90 backdrop-blur-sm shadow-lg border border-slate-200/60 hover:shadow-xl hover:shadow-blue-200/40 transition-all duration-300 hover:-translate-y-2 group rounded-xl">
                <div className="text-center p-6">
                  <div className="bg-gradient-to-r from-slate-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md group-hover:shadow-slate-400/50">
                    <Coffee className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl text-slate-800 font-bold mb-4">
                    Café Quality
                  </h4>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-slate-700 text-center">
                    Like the perfect morning brew, our treats are crafted with
                    precision and care, using premium ingredients that create
                    moments of pure tranquility.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100/90 to-gray-100/90 backdrop-blur-sm shadow-lg border border-blue-200/60 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 group rounded-xl">
                <div className="text-center p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-slate-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md group-hover:shadow-blue-400/50">
                    <Cloud className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl text-slate-800 font-bold mb-4">
                    sweet Collection
                  </h4>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-slate-700 text-center">
                    From misty morning pastries to stormy afternoon chocolates, our
                    collection captures the ever-changing beauty of sky and weather
                    in every bite.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-100/90 to-slate-100/90 backdrop-blur-sm shadow-lg border border-gray-200/60 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-2 group rounded-xl">
                <div className="text-center p-6">
                  <div className="bg-gradient-to-r from-gray-500 to-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md group-hover:shadow-gray-400/50">
                    <Wind className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl text-slate-800 font-bold mb-4">
                    Peaceful Moments
                  </h4>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-slate-700 text-center">
                    Experience the perfect harmony of taste and serenity, where
                    every sweet brings the calm of a cloudy day and the comfort
                    of your favorite café corner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-6 bg-gradient-to-r from-slate-400 via-blue-400 to-gray-500 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-5 left-10 text-slate-300 opacity-40 animate-pulse">
              <Cloud className="h-20 w-20 transform rotate-12" />
            </div>
            <div className="absolute bottom-5 right-10 text-blue-300 opacity-35 animate-bounce">
              <Droplets className="h-24 w-24 transform -rotate-12" />
            </div>
            <div className="absolute top-1/2 left-1/2 text-gray-300 opacity-30 animate-ping">
              <Coffee className="h-16 w-16 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="container mx-auto text-center relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Droplets className="h-8 w-8 text-slate-100 mr-3" />
              <h3 className="text-4xl font-bold text-white">
                Visit Our sweet crafts
              </h3>
              <Wind className="h-8 w-8 text-blue-100 ml-3" />
            </div>
            <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
              Discover our complete collection of café-inspired confections,
              each thoughtfully catalogued with detailed information about
              ingredients, pricing, and the serenity they bring.
            </p>
            <button
              onClick={() => navigate("/inventory")}
              className="bg-gradient-to-r from-slate-700 to-blue-800 hover:from-slate-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl hover:shadow-slate-500/50 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 rounded-lg flex items-center justify-center mx-auto"
            >
              <Coffee className="h-5 w-5 mr-2" />
              Browse Our Menu
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Homepage;

