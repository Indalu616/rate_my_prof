import { Link } from "react-router-dom";
import { Star, Users, TrendingUp, Search, ArrowRight } from "lucide-react";

const Home = () => {
  const stats = [
    {
      label: "Total Professors",
      value: "150+",
      icon: Users,
      description: "Across all departments",
    },
    {
      label: "Student Reviews",
      value: "2.5K+",
      icon: Star,
      description: "Authentic feedback",
    },
    {
      label: "Departments",
      value: "12",
      icon: TrendingUp,
      description: "Comprehensive coverage",
    },
  ];

  const features = [
    {
      title: "Find the Right Professor",
      description:
        "Browse through detailed profiles with ratings, reviews, and course information to make informed decisions.",
      icon: Search,
    },
    {
      title: "Authentic Student Reviews",
      description:
        "Read real experiences from students who have taken classes with each professor.",
      icon: Star,
    },
    {
      title: "Department-wise Organization",
      description:
        "Easily navigate through different academic departments and find professors in your field of study.",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium text-slate-800">
            Find the Perfect Professor
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Make informed decisions about your education with authentic student
            reviews and detailed professor profiles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/professors" className="btn-primary">
            Browse Professors
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/signup" className="btn-outline">
            Get Started
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-slate-800 mb-2">
            Platform Statistics
          </h2>
          <p className="text-slate-600">Trusted by thousands of students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card-elevated p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-medium text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-700 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-slate-800 mb-2">
            Why Choose RateMyProf?
          </h2>
          <p className="text-slate-600">
            Everything you need to make the right choice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card-elevated p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="card-elevated p-8 text-center">
        <h2 className="text-2xl font-medium text-slate-800 mb-3">
          Ready to Find Your Perfect Professor?
        </h2>
        <p className="text-slate-600 mb-6 max-w-lg mx-auto">
          Join thousands of students who are already making informed decisions
          about their education.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signup" className="btn-primary">
            Create Account
          </Link>
          <Link to="/professors" className="btn-outline">
            Browse Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
