import { useState } from 'react';

const RecommendationsPage = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [domain, setDomain] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [projects, setProjects] = useState([])

  // Sample tech stack and domain options
  const techOptions = ['React', 'Node.js', 'Python', 'Django', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL'];
  const domainOptions = ['Web Development', 'Mobile App', 'AI/ML', 'Data Science', 'Blockchain', 'DevOps', 'Cloud Computing'];
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

  // Extended professional project images (50+ tech-related images)
    const projectImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  ];

  const getRandomImage = () => {
    return projectImages[Math.floor(Math.random() * projectImages.length)];
  };

  const getProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.VITE_RECOMMEND_BACKEND_URL}/getProjects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const project_list = await response.json();
      console.log(project_list)
      setProjects(project_list);
    
      if (project_list.length === 0) {
        setError('No projects exist.');
        getProjects()
      }

    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Something went wrong while getting the projects.');
      setRecommendations([]);
      setDisplayedProjects([]);
    } finally {
      setLoading(false);
    }
  }

  const handleRecommend = async () => {
    if (!inputTitle.trim() && techStack.length === 0 && domain.length === 0 && !difficulty) {
      setError('Please enter at least one filter criteria.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/recommend', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          title: inputTitle + ' ' + techStack.join(',') + ' '  + domain.join(',') + ' ' + difficulty
        })
      });

      const recs = await response.json();
      setRecommendations(recs);
    
      if(recs && !recs.message){
        setDisplayedProjects(recs.slice(0, visibleCount));
      }

      if (recs.length === 0) {
        setError('No similar projects found with these filters.');
        getProjects()
      }

    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Something went wrong while getting the projects.');
      setRecommendations([]);
      setDisplayedProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const newCount = visibleCount + 6;
    setDisplayedProjects(recommendations.slice(0, newCount));
    setVisibleCount(newCount);
  };

  const toggleTechStack = (tech) => {
    setTechStack(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };

  const toggleDomain = (dom) => {
    setDomain(prev => 
      prev.includes(dom) 
        ? prev.filter(d => d !== dom) 
        : [...prev, dom]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Discover Similar Projects
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Find projects matching your interests and tech stack
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Search by title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4977ec] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack
              </label>
              <div className="flex flex-wrap gap-2">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechStack(tech)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      techStack.includes(tech)
                        ? 'bg-[#4977ec] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <div className="flex flex-wrap gap-2">
                {domainOptions.map((dom) => (
                  <button
                    key={dom}
                    onClick={() => toggleDomain(dom)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      domain.includes(dom)
                        ? 'bg-[#4977ec] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {difficultyOptions.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff === difficulty ? '' : diff)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficulty === diff
                        ? 'bg-[#4977ec] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleRecommend}
            className="w-full md:w-auto bg-[#4977ec] text-white px-6 py-2 rounded-md hover:bg-[#3a66d4] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4977ec] focus:ring-offset-2"
          >
            Find Similar Projects
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4977ec]"></div>
            <p className="mt-2 text-gray-600">Searching for matching projects...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        {displayedProjects.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {recommendations.length} Similar Projects Found
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((rec, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getRandomImage()} 
                      alt={rec.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h4 className="text-lg font-bold text-white">{rec.title}</h4>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                          {rec.domain}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ml-1 ${
                          rec.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          rec.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <span className="text-xs  mt-1 text-gray-500 whitespace-nowrap">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{rec.description}</p>
                    
                    {/*  Tech Stack Section */}
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                        <span className="mr-2">Tech Stack</span>
                        <span className="flex-1 border-t border-dotted border-gray-300"></span>
                      </h5>
                      <div className="flex flex-wrap gap-2 bg-gray-100 px-2 w-fit border border-gray-300 rounded-md">
                        {rec.tech_stack?.split(',').map((tech, i) => (
                          <div key={i} className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-800 relative">
                              {tech.trim()}
                              {i < rec.tech_stack.split(',').length - 1 && (
                                <span className="absolute -right-2 w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags Section */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                        <span className="mr-2">Tags</span>
                        <span className="flex-1 border-t border-dotted border-gray-300"></span>
                      </h5>
                      <div className="flex flex-wrap gap-2 bg-gray-100 border border-gray-300 w-fit p-2 rounded-lg">
                        {rec.tags?.split(',').map((tag, i, arr) => (
                          <div key={i} className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-800 bg-gray-200">
                              {tag.trim()}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
              </div>
              ))}
            </div>

            {recommendations.length > displayedProjects.length && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4977ec] hover:bg-[#3a66d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4977ec]"
                >
                  Show More Projects
                  <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {recommendations.length > 0 && recommendations.length === displayedProjects.length && (
              <div className="text-center py-6 text-gray-500">
                No more projects to show
              </div>
            )}
          </div>
        )}

        {projects.length > 0 && (
          <>
              <h2 className="text-lg p-2 mb-4 font-semibold text-gray-900 ">
                No Similar Projects , You can Browse throw below projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getRandomImage()} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h4 className="text-lg font-bold text-white">{project.title}</h4>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                          {project.domain}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ml-1 ${
                          project.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          project.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.difficulty_level}
                        </span>
                      </div>
                      <span className="text-xs  mt-1 text-gray-500 whitespace-nowrap">
                        {new Date(project.created_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    
                    {/*  Tech Stack Section */}
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                        <span className="mr-2">Tech Stack</span>
                        <span className="flex-1 border-t border-dotted border-gray-300"></span>
                      </h5>
                      <div className="flex flex-wrap gap-2 bg-gray-100 px-2 w-fit border border-gray-300 rounded-md">
                        {project.tech_stack?.split(',').map((tech, i) => (
                          <div key={i} className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-800 relative">
                              {tech.trim()}
                              {i < project.tech_stack.split(',').length - 1 && (
                                <span className="absolute -right-2 w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags Section */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
                        <span className="mr-2">Tags</span>
                        <span className="flex-1 border-t border-dotted border-gray-300"></span>
                      </h5>
                      <div className="flex flex-wrap gap-2 bg-gray-100 border border-gray-300 w-fit p-2 rounded-lg">
                        {project.tags?.split(',').map((tag, i, arr) => (
                          <div key={i} className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-800 bg-gray-200">
                              {tag.trim()}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
              </div>
              ))}
            </div>
            </>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;