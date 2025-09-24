// Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:emyraeleson@gmail.com?subject=${encodeURIComponent(subject || 'Contact from Portfolio')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Email client opened! Please send your message.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Download resume button - now links directly to PDF file
    // No additional JavaScript needed as the link handles the download

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-card, .skill-category, .experience-card, .featured-project');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Load GitHub projects
    loadGitHubProjects();

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
});

// GitHub Projects Loading
async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('github-projects');
    if (!projectsGrid) return;
    
    // Always show static projects first
    showStaticProjects();
    
    try {
        const response = await fetch('https://api.github.com/users/Emyrael/repos?sort=updated&per_page=6');
        const repos = await response.json();
        
        // Filter and display additional projects (not already in static projects)
        const staticProjectNames = ['End-to-End-Self-Driving-via-Convolutional-Neural-Networks-', 'Ginja App', 'Data Pipeline Automation'];
        
        // Only show the top 3 static projects, no additional GitHub repos
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        // Static projects are already shown, so no fallback needed
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.backgroundColor = '#1f2937';
    card.style.border = '1px solid #374151';
    card.style.color = '#f9fafb';
    
    const languages = repo.language || 'Various';
    const topics = repo.topics ? repo.topics.slice(0, 3) : [];
    
    card.innerHTML = `
        <h3 style="color: #f9fafb !important;">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
        <p style="color: #e5e7eb !important;">${repo.description || 'No description available'}</p>
        <div class="project-tech">
            <span class="tech-badge">${languages}</span>
            ${topics.map(topic => `<span class="tech-badge">${topic}</span>`).join('')}
        </div>
        <div class="project-stats">
            <div class="stat">
                <i class="fas fa-star"></i>
                <span style="color: #d1d5db !important;">${repo.stargazers_count}</span>
            </div>
            <div class="stat">
                <i class="fas fa-code-branch"></i>
                <span style="color: #d1d5db !important;">${repo.forks_count}</span>
            </div>
        </div>
    `;
    
    // Add click handler to open repository
    card.addEventListener('click', () => {
        window.open(repo.html_url, '_blank');
    });
    
    return card;
}

function showStaticProjects() {
    const projectsGrid = document.getElementById('github-projects');
    if (!projectsGrid) return;
    
    const staticProjects = [
        {
            name: 'End-to-End-Self-Driving-via-Convolutional-Neural-Networks-',
            description: 'Advanced CNN implementation for autonomous vehicle control. Trained neural networks to map raw camera pixels directly to steering commands, enabling self-driving capabilities on various road conditions.',
            tech: ['Python', 'TensorFlow', 'OpenCV', 'Neural Networks', 'Computer Vision'],
            stats: { stars: 8, forks: 3 },
            link: 'https://github.com/Emyrael/End-to-End-Self-Driving-via-Convolutional-Neural-Networks-'
        },
        {
            name: 'Ginja App',
            description: 'Revolutionary AI platform that will transform how businesses and individuals interact with artificial intelligence. Built with cutting-edge technology to provide seamless, intuitive AI experiences that bridge the gap between complex AI capabilities and everyday usability.',
            tech: ['AI/ML', 'Advanced NLP', 'Web Development', 'User Experience', 'Innovation'],
            stats: { stars: 0, forks: 0 },
            link: 'https://www.ginjaapp.com',
            special: 'coming-soon'
        },
        {
            name: 'Data Pipeline Automation',
            description: 'Enterprise-grade ETL pipeline processing real-time financial data with 99.9% uptime. Automated workflows using Apache Airflow with comprehensive monitoring and alerting systems.',
            tech: ['Python', 'Apache Airflow', 'PostgreSQL', 'Docker', 'Monitoring'],
            stats: { stars: 12, forks: 5 }
        }
    ];
    
    staticProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.backgroundColor = '#1f2937';
        card.style.border = '1px solid #374151';
        card.style.color = '#f9fafb';
        
        if (project.special === 'coming-soon') {
            card.innerHTML = `
                <div class="coming-soon-badge">Coming Soon</div>
                <h3 style="color: #f9fafb !important;">${project.name}</h3>
                <p style="color: #e5e7eb !important;">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <a href="${project.link}" class="btn btn-primary" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        Join Waitlist
                    </a>
                </div>
            `;
        } else {
            card.innerHTML = `
                <h3 style="color: #f9fafb !important;">${project.name}</h3>
                <p style="color: #e5e7eb !important;">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span style="color: #d1d5db !important;">${project.stats.stars}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code-branch"></i>
                        <span style="color: #d1d5db !important;">${project.stats.forks}</span>
                    </div>
                </div>
                ${project.link ? `<div class="project-actions">
                    <a href="${project.link}" class="btn btn-secondary" target="_blank">
                        <i class="fas fa-code"></i>
                        View Code
                    </a>
                </div>` : ''}
            `;
        }
        
        projectsGrid.appendChild(card);
    });
}

// Add CSS for project cards and animations
const additionalCSS = `
    .project-card {
        background-color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .project-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .project-card h3 {
        font-size: 1.3rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
    }
    
    .project-card p {
        color: #4b5563;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .project-stats {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .stat i {
        color: #2563eb;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-link.active {
        background-color: #eff6ff;
        color: #2563eb;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .coming-soon-badge {
        position: absolute;
        top: -12px;
        right: 1rem;
        background-color: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        animation: pulse 2s infinite;
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .project-card {
        position: relative;
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
