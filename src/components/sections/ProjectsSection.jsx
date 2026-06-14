import { RingCarousel } from '../ui/RingCarousel'
import { PROJECTS } from '../../data/portfolioData'

const FULL_CONTENT = {
  criclytics: `<p>Criclytics is an intelligent cricket analytics platform that transforms historical match data into context-aware probabilities and interpretable machine-learning insights for players, teams, and venues. Built to provide cricket enthusiasts, analysts, and fantasy league players with data-driven predictions and comprehensive performance analysis.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Player performance prediction using historical statistics and match context</li>
<li>Team win probability calculator with venue-specific adjustments</li>
<li>Head-to-head analysis between players and teams</li>
<li>Venue impact assessment on player and team performance</li>
<li>Machine learning models trained on extensive cricket match database</li>
<li>Real-time probability updates based on match progression</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented context-aware ML models that consider venue, opposition, and match conditions</li>
<li>Designed efficient data pipeline to process and analyze thousands of historical matches</li>
<li>Created feature engineering techniques to capture cricketing context (pitch conditions, weather, player form)</li>
<li>Built interactive web interface for seamless user experience with complex data</li>
<li>Optimized model inference for real-time probability calculations</li>
</ul>
<p><strong style="color:#f1f5f9">Impact:</strong></p>
<p>Criclytics provides cricket enthusiasts with professional-grade analytics previously available only to professional teams, democratizing access to data-driven cricket insights and enhancing fantasy league decision-making.</p>
<strong>Tech Stack:</strong> Python, Machine Learning, HTML, CSS, JavaScript<br/>
<strong>Development Time:</strong> 4 months`,
  fashion: `<p>An advanced clothing image classifier that accurately predicts fashion categories including T-shirts, Shirts, Dresses, Pants, Shoes, Jackets, Sweaters, and Tops. Built using deep learning (CNN) achieving 92.25% accuracy and traditional machine learning (Random Forest) with 87.56% accuracy. Features a user-friendly Streamlit web interface for real-time predictions.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Dual model architecture: CNN (TensorFlow/Keras) and Random Forest (scikit-learn)</li>
<li>92.25% classification accuracy with convolutional neural network</li>
<li>Interactive Streamlit web interface for image upload and prediction</li>
<li>Real-time image processing and category prediction</li>
<li>Support for 8 distinct fashion categories</li>
<li>Model comparison dashboard showing performance metrics</li>
<li>Confidence score display for each prediction</li>
<li>Batch processing capability for multiple images</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented transfer learning with pre-trained networks to improve accuracy</li>
<li>Designed custom CNN architecture optimized for fashion image recognition</li>
<li>Handled class imbalance through data augmentation and stratified sampling</li>
<li>Created efficient image preprocessing pipeline for consistent results</li>
<li>Optimized model size for fast inference without sacrificing accuracy</li>
<li>Built intuitive UI/UX for non-technical users to leverage ML models</li>
</ul>
<p><strong style="color:#f1f5f9">Applications:</strong></p>
<p>This classifier can be integrated into e-commerce platforms for automatic product categorization, fashion recommendation systems, inventory management, and visual search features, significantly reducing manual labeling effort and improving customer experience.</p>
<strong>Tech Stack:</strong> Python, TensorFlow, Keras, scikit-learn, Streamlit, OpenCV, NumPy, Pandas<br/>
<strong>Model Performance:</strong> CNN: 92.25% | Random Forest: 87.56%`,
  travelbuddy: `<p>TravelBuddy is a full-stack web application designed to revolutionize how people plan and experience travel. Built with ReactJS, NodeJS, SQL, and AI integration, the platform bridges smart trip planning with genuine social connections.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Buddy matching to connect travelers with shared goals and styles</li>
<li>Vlogger and social hub for sharing journeys and community engagement</li>
<li>Reviews and trust scores for transparency and reputation</li>
<li>Expense sharing with multi-currency group cost management</li>
<li>AI itinerary generator for personalized day-by-day planning</li>
<li>Hotel and restaurant reviews with community-driven ratings</li>
<li>Live currency converter for accurate budgeting</li>
<li>Best routes and transport suggestions for optimized travel</li>
<li>Currency and language tools for easier trip handling</li>
<li>Emergency assistance and to-do lists for safety and organization</li>
</ul>
<p><strong style="color:#f1f5f9">Impact:</strong></p>
<p>This project allowed me to combine backend logic, frontend design, SQL/database management, and AI-driven tools to deliver features that improve trust, budgeting, and overall travel experience.</p>
<strong>Tech Stack:</strong> ReactJS, NodeJS, Database Systems/SQL, AI`,
  webcraft: `<p>WebCraft is my professional freelance web developer portfolio featuring animated UI, comprehensive service showcases, fully functional order and contact forms with real email delivery via Gmail SMTP, and serverless deployment on Vercel. A complete business presence demonstrating full-stack capabilities.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Modern, animated UI with smooth scroll effects and micro-interactions</li>
<li>Fully functional contact and order forms with Gmail SMTP integration</li>
<li>Real-time email notifications for new inquiries and orders</li>
<li>Service showcase with detailed pricing and package information</li>
<li>Project portfolio with filterable categories</li>
<li>Testimonials section with client reviews</li>
<li>Serverless architecture deployed on Vercel</li>
<li>Fully responsive design optimized for all devices</li>
<li>SEO optimized with meta tags and semantic HTML</li>
<li>Custom domain integration with SSL certificate</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented secure Gmail SMTP with OAuth2 authentication for reliable email delivery</li>
<li>Built serverless functions in Node.js for form processing without backend server</li>
<li>Created custom animations using CSS and JavaScript for professional polish</li>
<li>Optimized performance with lazy loading and code splitting</li>
<li>Implemented form validation and spam protection</li>
<li>Designed mobile-first responsive layout that works flawlessly across devices</li>
<li>Set up CI/CD pipeline for automatic deployments on code push</li>
</ul>
<p><strong style="color:#f1f5f9">Business Impact:</strong></p>
<p>WebCraft serves as both a portfolio and a lead generation platform, successfully converting visitors into clients through strategic CTAs, trust-building elements, and seamless inquiry process.</p>
<strong>Tech Stack:</strong> HTML, CSS, JavaScript, Node.js, Gmail SMTP API, Vercel<br/>
<strong>Performance:</strong> 95+ Lighthouse score, &lt; 2s load time`,
  flappy: `<p>A faithful recreation of the iconic Flappy Bird game written entirely in 16-bit assembly language for iAPX8088 processors. This project demonstrates low-level programming mastery with physics-based gravity simulation, procedurally generated obstacles, smooth scrolling graphics, and real-time score tracking—all implemented without high-level language abstractions.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Complete game loop with collision detection written in pure assembly</li>
<li>Physics-based gravity and flap mechanics for realistic bird movement</li>
<li>Procedurally generated pipe obstacles with randomized heights</li>
<li>Smooth scrolling background with parallax effect</li>
<li>Real-time score tracking and display</li>
<li>Progressive difficulty increase as score advances</li>
<li>Keyboard controls with responsive input handling</li>
<li>Game over detection with restart functionality</li>
<li>VGA graphics mode for colorful visual display</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented fixed-point arithmetic for smooth gravity simulation without floating-point unit</li>
<li>Designed efficient sprite rendering system using direct VGA memory manipulation</li>
<li>Created collision detection algorithms optimized for 8088 instruction set</li>
<li>Built pseudo-random number generator for obstacle variation</li>
<li>Managed memory constraints with careful register allocation and stack usage</li>
<li>Optimized rendering loop to maintain consistent frame rate on limited hardware</li>
<li>Implemented interrupt handling for keyboard input without blocking game logic</li>
</ul>
<p><strong style="color:#f1f5f9">Learning Outcomes:</strong></p>
<p>This project provided deep understanding of computer architecture, CPU instruction sets, memory management, and graphics programming at the hardware level.</p>
<strong>Tech Stack:</strong> 16-bit x86 Assembly Language, IAPX8088 Architecture, VGA Graphics<br/>
<strong>Complexity:</strong> 1000+ lines of pure assembly code`,
  bubble: `<p>A classic arcade-style bubble shooter game written entirely in 16-bit assembly language for IAPX8088 processors. Players control a shooter at the bottom of the screen to pop falling green bubbles before they reach the player. Features real-time graphics rendering, smooth keyboard controls, interactive menu system, and increasing difficulty levels—all implemented in low-level assembly code.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Interactive main menu with start, instructions, and exit options</li>
<li>Real-time graphics rendering using VGA mode 13h (320x200, 256 colors)</li>
<li>Smooth horizontal shooter movement with keyboard controls</li>
<li>Falling bubble mechanics with collision detection</li>
<li>Shooting projectile system with precise trajectory calculation</li>
<li>Score tracking and display system</li>
<li>Lives counter with game over condition</li>
<li>Progressive difficulty with faster bubble speeds</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented efficient sprite rendering without sprite libraries or graphics APIs</li>
<li>Designed collision detection system using bounding box algorithms in assembly</li>
<li>Created smooth animation loops synchronized with system timer interrupts</li>
<li>Built keyboard input handler using BIOS interrupts with non-blocking reads</li>
<li>Managed multiple moving objects (bubbles, projectiles) with limited CPU cycles</li>
<li>Optimized memory access patterns for VGA buffer to prevent flickering</li>
<li>Implemented game state machine for menu, gameplay, and game over screens</li>
<li>Developed pseudo-random number generation for bubble spawn positions</li>
</ul>
<p><strong style="color:#f1f5f9">Educational Value:</strong></p>
<p>This project demonstrates mastery of low-level programming concepts including direct hardware manipulation, interrupt handling, memory-mapped I/O, and algorithmic optimization under severe resource constraints.</p>
<strong>Tech Stack:</strong> 16-bit x86 Assembly Language, IAPX8088 Processor, VGA Graphics Mode 13h<br/>
<strong>Code Size:</strong> 800+ lines of assembly code`,
  solar: `<p>Developed a C++ console-based solar energy system predictor. It estimates optimal solar panel configurations, including panel types, inverters, batteries, and wiring, based on user inputs like house area, and energy consumption. Provides detailed cost estimates, enabling homeowners and solar enthusiasts to explore renewable energy options.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>Calculates ideal panel types, inverter capacity, batteries, and wiring based on user inputs (house area, energy consumption, and sunlight availability)</li>
<li>Generates comprehensive cost estimates for different configurations</li>
<li>Provides energy production forecasts to assist in long-term planning</li>
<li>Predicts best type and number of Plates, Inverters, Batteries and Wires required based on users data</li>
<li>User-friendly console interface with clear step-by-step guidance</li>
<li>Modular design for easy feature expansion and maintenance</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented custom algorithms to match energy demand with panel output and battery storage</li>
<li>Designed a dynamic cost calculator that factors in component prices and regional variations</li>
<li>Optimized data handling and calculations for fast, real-time results in a console environment</li>
</ul>
<strong>Tech Stack:</strong> C++, File I/O for persistent data, Input Validation`,
  relive: `<p>The ReLive App is a simple console-based social network simulation built entirely in C++ without using built-in functions or STL containers. This project reflects the core concepts of OOP including inheritance, encapsulation, and polymorphism, manual data handling, and structured logic design efficiently managing user data and connections.</p>
<p><strong style="color:#f1f5f9">Key Features:</strong></p>
<ul>
<li>User account creation, login, and profile management</li>
<li>Post creation, timeline view, and interactive comment system</li>
<li>Dynamic memory allocation for posts, comments, and user relationships</li>
<li>Intuitive console interface with organized menu-driven navigation</li>
</ul>
<p><strong style="color:#f1f5f9">Technical Challenges Solved:</strong></p>
<ul>
<li>Implemented inheritance, encapsulation, and polymorphism to model complex social interactions</li>
<li>Managed all string operations manually without using built-in functions</li>
<li>Designed custom dynamic data structures for efficient storage and retrieval of user-generated content</li>
<li>Ensured memory safety with precise allocation and deallocation routines</li>
</ul>
<strong>Tech Stack:</strong> C++, Object Oriented Programming, Encapsulation, Polymorphism, Inheritance`,
}

const mappedProjects = PROJECTS.map((p) => ({
  id: p.id,
  icon: <i className="fas fa-code" style={{ color: '#a78bfa' }} />,
  title: p.name,
  shortDesc: p.description,
  fullContent: FULL_CONTENT[p.id] || `<p>${p.modal.description}</p>`,
  links: p.links,
}))

export default function ProjectsSection() {
  return (
    <section id="projects" className="portfolio-section" style={{ height: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: '40vw',
          width: '60vw',
          height: '100vh',
          padding: '1rem 4rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <h2
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: '0 0 2rem',
            flexShrink: 0,
          }}
        >
          Featured Projects
        </h2>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <RingCarousel cards={mappedProjects} accentColor="#7c3aed" />
        </div>
      </div>
    </section>
  )
}
