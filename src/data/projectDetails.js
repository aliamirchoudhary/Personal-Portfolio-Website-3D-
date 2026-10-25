export default {
  criclytics: [
    {
      type: 'paragraph',
      text: 'Criclytics is an intelligent cricket analytics platform that transforms historical match data into context-aware probabilities and interpretable machine-learning insights for players, teams, and venues. Built to provide cricket enthusiasts, analysts, and fantasy league players with data-driven predictions and comprehensive performance analysis.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'Player performance prediction using historical statistics and match context',
        'Team win probability calculator with venue-specific adjustments',
        'Head-to-head analysis between players and teams',
        'Venue impact assessment on player and team performance',
        'Machine learning models trained on extensive cricket match database',
        'Real-time probability updates based on match progression',
      ],
    },
    {
      type: 'heading',
      text: 'Technical Challenges Solved:',
    },
    {
      type: 'list',
      items: [
        'Implemented context-aware ML models that consider venue, opposition, and match conditions',
        'Designed efficient data pipeline to process and analyze thousands of historical matches',
        'Created feature engineering techniques to capture cricketing context (pitch conditions, weather, player form)',
        'Built interactive web interface for seamless user experience with complex data',
        'Optimized model inference for real-time probability calculations',
      ],
    },
    {
      type: 'heading',
      text: 'Impact:',
    },
    {
      type: 'paragraph',
      text: 'Criclytics provides cricket enthusiasts with professional-grade analytics previously available only to professional teams, democratizing access to data-driven cricket insights and enhancing fantasy league decision-making.',
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: Python, Machine Learning, HTML, CSS, JavaScript',
    },
    {
      type: 'paragraph',
      text: 'Development Time: 4 months',
    },
  ],
  fashion: [
    {
      type: 'paragraph',
      text: 'An advanced clothing image classifier that accurately predicts fashion categories including T-shirts, Shirts, Dresses, Pants, Shoes, Jackets, Sweaters, and Tops. Built using deep learning (CNN) achieving 92.25% accuracy and traditional machine learning (Random Forest) with 87.56% accuracy. Features a user-friendly Streamlit web interface for real-time predictions.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'Dual model architecture: CNN (TensorFlow/Keras) and Random Forest (scikit-learn)',
        '92.25% classification accuracy with convolutional neural network',
        'Interactive Streamlit web interface for image upload and prediction',
        'Real-time image processing and category prediction',
        'Support for 8 distinct fashion categories',
        'Model comparison dashboard showing performance metrics',
        'Confidence score display for each prediction',
        'Batch processing capability for multiple images',
      ],
    },
    {
      type: 'heading',
      text: 'Technical Challenges Solved:',
    },
    {
      type: 'list',
      items: [
        'Implemented transfer learning with pre-trained networks to improve accuracy',
        'Designed custom CNN architecture optimized for fashion image recognition',
        'Handled class imbalance through data augmentation and stratified sampling',
        'Created efficient image preprocessing pipeline for consistent results',
        'Optimized model size for fast inference without sacrificing accuracy',
        'Built intuitive UI/UX for non-technical users to leverage ML models',
      ],
    },
    {
      type: 'heading',
      text: 'Applications:',
    },
    {
      type: 'paragraph',
      text: 'This classifier can be integrated into e-commerce platforms for automatic product categorization, fashion recommendation systems, inventory management, and visual search features, significantly reducing manual labeling effort and improving customer experience.',
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: Python, TensorFlow, Keras, scikit-learn, Streamlit, OpenCV, NumPy, Pandas',
    },
    {
      type: 'paragraph',
      text: 'Model Performance: CNN: 92.25% | Random Forest: 87.56%',
    },
  ],
  travelbuddy: [
    {
      type: 'paragraph',
      text: 'TravelBuddy is a full-stack web application designed to revolutionize how people plan and experience travel. Built with ReactJS, NodeJS, SQL, and AI integration, the platform bridges smart trip planning with genuine social connections.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'Buddy matching to connect travelers with shared goals and styles',
        'Vlogger and social hub for sharing journeys and community engagement',
        'Reviews and trust scores for transparency and reputation',
        'Expense sharing with multi-currency group cost management',
        'AI itinerary generator for personalized day-by-day planning',
        'Hotel and restaurant reviews with community-driven ratings',
        'Live currency converter for accurate budgeting',
        'Best routes and transport suggestions for optimized travel',
        'Currency and language tools for easier trip handling',
        'Emergency assistance and to-do lists for safety and organization',
      ],
    },
    {
      type: 'heading',
      text: 'Impact:',
    },
    {
      type: 'paragraph',
      text: 'This project allowed me to combine backend logic, frontend design, SQL/database management, and AI-driven tools to deliver features that improve trust, budgeting, and overall travel experience.',
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: ReactJS, NodeJS, Database Systems/SQL, AI',
    },
  ],
  flappy: [
    {
      type: 'paragraph',
      text: 'A faithful recreation of the iconic Flappy Bird game written entirely in 16-bit assembly language for iAPX8088 processors. This project demonstrates low-level programming mastery with physics-based gravity simulation, procedurally generated obstacles, smooth scrolling graphics, and real-time score tracking—all implemented without high-level language abstractions.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'Complete game loop with collision detection written in pure assembly',
        'Physics-based gravity and flap mechanics for realistic bird movement',
        'Procedurally generated pipe obstacles with randomized heights',
        'Smooth scrolling background with parallax effect',
        'Real-time score tracking and display',
        'Progressive difficulty increase as score advances',
        'Keyboard controls with responsive input handling',
        'Game over detection with restart functionality',
        'VGA graphics mode for colorful visual display',
      ],
    },
    {
      type: 'heading',
      text: 'Technical Challenges Solved:',
    },
    {
      type: 'list',
      items: [
        'Implemented fixed-point arithmetic for smooth gravity simulation without floating-point unit',
        'Designed efficient sprite rendering system using direct VGA memory manipulation',
        'Created collision detection algorithms optimized for 8088 instruction set',
        'Built pseudo-random number generator for obstacle variation',
        'Managed memory constraints with careful register allocation and stack usage',
        'Optimized rendering loop to maintain consistent frame rate on limited hardware',
        'Implemented interrupt handling for keyboard input without blocking game logic',
      ],
    },
    {
      type: 'heading',
      text: 'Learning Outcomes:',
    },
    {
      type: 'paragraph',
      text: 'This project provided deep understanding of computer architecture, CPU instruction sets, memory management, and graphics programming at the hardware level.',
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: 16-bit x86 Assembly Language, IAPX8088 Architecture, VGA Graphics',
    },
    {
      type: 'paragraph',
      text: 'Complexity: 1000+ lines of pure assembly code',
    },
  ],
  bubble: [
    {
      type: 'paragraph',
      text: 'A classic arcade-style bubble shooter game written entirely in 16-bit assembly language for IAPX8088 processors. Players control a shooter at the bottom of the screen to pop falling green bubbles before they reach the player. Features real-time graphics rendering, smooth keyboard controls, interactive menu system, and increasing difficulty levels—all implemented in low-level assembly code.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'Interactive main menu with start, instructions, and exit options',
        'Real-time graphics rendering using VGA mode 13h (320x200, 256 colors)',
        'Smooth horizontal shooter movement with keyboard controls',
        'Falling bubble mechanics with collision detection',
        'Shooting projectile system with precise trajectory calculation',
        'Score tracking and display system',
        'Lives counter with game over condition',
        'Progressive difficulty with faster bubble speeds',
      ],
    },
    {
      type: 'heading',
      text: 'Technical Challenges Solved:',
    },
    {
      type: 'list',
      items: [
        'Implemented efficient sprite rendering without sprite libraries or graphics APIs',
        'Designed collision detection system using bounding box algorithms in assembly',
        'Created smooth animation loops synchronized with system timer interrupts',
        'Built keyboard input handler using BIOS interrupts with non-blocking reads',
        'Managed multiple moving objects (bubbles, projectiles) with limited CPU cycles',
        'Optimized memory access patterns for VGA buffer to prevent flickering',
        'Implemented game state machine for menu, gameplay, and game over screens',
        'Developed pseudo-random number generation for bubble spawn positions',
      ],
    },
    {
      type: 'heading',
      text: 'Educational Value:',
    },
    {
      type: 'paragraph',
      text: 'This project demonstrates mastery of low-level programming concepts including direct hardware manipulation, interrupt handling, memory-mapped I/O, and algorithmic optimization under severe resource constraints.',
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: 16-bit x86 Assembly Language, IAPX8088 Processor, VGA Graphics Mode 13h',
    },
    {
      type: 'paragraph',
      text: 'Code Size: 800+ lines of assembly code',
    },
  ],
  solar: [
    {
      type: 'paragraph',
      text: 'Developed a C++ console-based solar energy system predictor. It estimates optimal solar panel configurations, including panel types, inverters, batteries, and wiring, based on user inputs like house area, and energy consumption. Provides detailed cost estimates, enabling homeowners and solar enthusiasts to explore renewable energy options.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'Calculates ideal panel types, inverter capacity, batteries, and wiring based on user inputs (house area, energy consumption, and sunlight availability)',
        'Generates comprehensive cost estimates for different configurations',
        'Provides energy production forecasts to assist in long-term planning',
        'Predicts best type and number of Plates, Inverters, Batteries and Wires required based on users data',
        'User-friendly console interface with clear step-by-step guidance',
        'Modular design for easy feature expansion and maintenance',
      ],
    },
    {
      type: 'heading',
      text: 'Technical Challenges Solved:',
    },
    {
      type: 'list',
      items: [
        'Implemented custom algorithms to match energy demand with panel output and battery storage',
        'Designed a dynamic cost calculator that factors in component prices and regional variations',
        'Optimized data handling and calculations for fast, real-time results in a console environment',
      ],
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: C++, File I/O for persistent data, Input Validation',
    },
  ],
  relive: [
    {
      type: 'paragraph',
      text: 'The ReLive App is a simple console-based social network simulation built entirely in C++ without using built-in functions or STL containers. This project reflects the core concepts of OOP including inheritance, encapsulation, and polymorphism, manual data handling, and structured logic design efficiently managing user data and connections.',
    },
    {
      type: 'heading',
      text: 'Key Features:',
    },
    {
      type: 'list',
      items: [
        'User account creation, login, and profile management',
        'Post creation, timeline view, and interactive comment system',
        'Dynamic memory allocation for posts, comments, and user relationships',
        'Intuitive console interface with organized menu-driven navigation',
      ],
    },
    {
      type: 'heading',
      text: 'Technical Challenges Solved:',
    },
    {
      type: 'list',
      items: [
        'Implemented inheritance, encapsulation, and polymorphism to model complex social interactions',
        'Managed all string operations manually without using built-in functions',
        'Designed custom dynamic data structures for efficient storage and retrieval of user-generated content',
        'Ensured memory safety with precise allocation and deallocation routines',
      ],
    },
    {
      type: 'paragraph',
      text: 'Tech Stack: C++, Object Oriented Programming, Encapsulation, Polymorphism, Inheritance',
    },
  ],
}
