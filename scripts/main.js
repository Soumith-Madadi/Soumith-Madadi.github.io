const TODAY = new Date();
const THIS_MONTH = TODAY.getMonth();
const THIS_YEAR = TODAY.getYear();
const FADE = 250;
let slideIndex = 0;
let slideChangeInterval = -1;
let spinInterval = -1;
let circleImageIII = true;

const mainCircle = $('#main-circle');
const modalImageHolder = $('#modal-image-holder');
const modalTitle = $('#modal h2');
const modalSubtitle = $('#modal h3');
const modalText = $('#modal p');
const modalImageChanger = $('#modal-image-changer');

class ProjectHolder {
  constructor(data) {
    this.title = data.title;
    this.category = data.category || '';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || 'Today';
    this.text = data.text || 'Details Coming Soon';
    this.height = data.height;

    this.color = this.chooseColor();
    this.images = data.images || [];
    this.images = this.images.map(image => 'images/' + image);

    this.$elem = data.$elem || $(`
    <div class="project-holder w3-display-container w3-${this.color}" style="height:${this.height}%">
      <span class="image-fader w3-${this.color}"></span>
      <span class="holder-category w3-display-topleft">${this.category}</span>
      <span class="holder-title">${this.title}</span>
      <span class="holder-date w3-display-bottomright">'${this.startDate.substr(-2)}</span>
    </div>`);

    this.subtitle = data.subtitle || `${this.category} (${this.startDate} - ${this.endDate})`;

    if (!data.$elem) {
      this.$title = this.$elem.find('.holder-title');
      this.hasLongWord = this.title.split(/\s/).some(word => word.length > 11);
      this.$images = this.images.map((image, extra) => {
        const $image = $(`<img class="holder-image" src="${image}">`);
        this.$elem.prepend($image);
  
        if (extra) {
          $image.addClass('hidden');
        }
        return $image;
      });
    }

    this.currentImageNum = 0;
    this.index = -1;
  }

  chooseColor() {
    return ProjectHolder.colors[this.category.length % ProjectHolder.colors.length];
  }
  setIndex(index) {
    this.$elem.attr('index', index);
    this.index = index;
  }

  static openedOrder = {};
  static opened = 0;
  static currentProjectProps = {};
  static colors = ['red', 'purple', 'blue', 'green', 'indigo', 'pink', 'black', 'orange'];
  static imageDirections = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
  // Right, Left, Up, Down

  nextImage () {
    if (this.images.length < 2) return;
    setTimeout(() => {
      const leavingImage = this.$images[this.currentImageNum];
      this.currentImageNum = (this.currentImageNum + 1) % this.images.length;
      const incomingImage = this.$images[this.currentImageNum];
      const direction = ProjectHolder.imageDirections[Math.floor(Math.random() * 4)];
  
      const holderWidth = this.$elem.width();
      const holderHeight = this.$elem.height();
  
      const leavingFinal = {
        left: direction.x * holderWidth,
        top: direction.y * holderHeight,
      };
  
      const incomingStart = {
        left: -direction.x * holderWidth,
        top: -direction.y * holderHeight,
      };
  
      incomingImage.css('top', incomingStart.top);
      incomingImage.css('left', incomingStart.left);
  
      incomingImage.removeClass('hidden');
  
      incomingImage.animate({top: 0, left: 0}, 1000);
      leavingImage.animate(leavingFinal, 1000, 'swing', () => leavingImage.addClass('hidden'));
      this.nextImage();
    }, Math.round(Math.random() * 6000) + 3000);
  }

  resizeTitle() {
    if (this.hasLongWord) {
      this.$title.css('font-size', $(window).width() <= 1200 ? 26 : 32);
    }
    const x = (this.$elem.width() - this.$title.width()) / 2;
    const y = (this.$elem.height() - this.$title.height()) / 2;
   
    this.$title.css('top', y);
    this.$title.css('left', x);
  }

  setModalContent() {
    modalTitle.text(this.title);
    modalSubtitle.text(this.subtitle);
    modalText.html(this.text);

    $('.modal-image-dot, .modal-image').remove();

    for (let i = this.images.length - 1; i >= 0; i--) {
      const image = this.images[i];
      modalImageHolder.prepend($(`<img class="modal-image" src="${image}">`));
    }

    if (this.images.length < 2) {
      modalImageChanger.hide();
    }
    else {
      modalImageChanger.show();
    }

    for (let i = 0; i < this.images.length; i++) {
      modalImageChanger.append($(`<span class="modal-image-dot w3-hover-black" onclick="showModalImage(${i})"></span>`));
    }

    const properties = {project: this.title, category: this.category};
    if (!ProjectHolder.openedOrder[this.index]) {
      ProjectHolder.opened++;
      ProjectHolder.openedOrder[this.index] = ProjectHolder.opened;
    }
    ProjectHolder.currentProjectProps = properties;

    $('.modal-image').click(expandImage);
    openModal();
  }

  resize() {
    this.resizeTitle();
  }

  start() {
    this.resize();
    this.nextImage();
  }
}


/** @type {ProjectHolder[]} */
const projects = [
  new ProjectHolder({
    title: 'App Development', 
    category: 'How I Started', 
    startDate: 'Sep 2018', 
    endDate: 'Jan 2019', 
    height: 50,

    images: ['scratch.png', 'hole.png'],
    text: `My journey through the world of computer science began when I was 12 years-old and was introduced to Scratch, our goal was to create a game. I decided to make a clicker game because I played cookie clicker and it was extremely fun! (as you can tell it didn't take much to entertain me as a kid) After I made this game, I had recently received my first computer meaning I could make even more games at home. My interest piqued, and I decided to make another game. This time it was going to be a maze where I navigated a labyrinth. Teaching myself how to code was an arduous task; I scoured through different online forums, studied countless YouTube videos, and sunk hours into trial and error. As I learned more about the coding process, my motivation based on the bits of joy from overcoming every challenge coding presented.
    <br><br>
    As I kept going with this project, I added levels, music, sounds effects, and animations to it. At this point, I was very satisfied but I knew something was missing. So, a year later I followed this project up with greater ambition to create a game with procedurally generated levels making a dozen levels based on the top-down maze genre. Developing a game of this scale required a lot of persistence and dedication. Since this game's primary audience is young children, I tried to implement game design principles and graphics that favor straightforward game mechanics and intuitive controls. I ended up putting this on Scratch and even though it didn't gain much traction, this has been a great learning experience for me. `
  }),
  new ProjectHolder({
    title: 'Softball Scoreboard', 
    category: 'IT', 
    startDate: 'Dec 2020', 
    endDate: 'Mar 2021', 
    height: 50,

    images: ['scoreboard.jpg'],
    text: `
    Our softball scoreboard project was a testament to our team's ingenuity and collaborative spirit. Faced with the need for a reliable and efficient scoring system, we embarked on the challenge of creating a custom scoreboard tailored to our softball games. Drawing on our collective expertise in electronics and programming, we designed and built a scoreboard that not only displayed scores and inning information but also enhanced the overall game experience for players and spectators alike. Incorporating LED displays from our Arduino and intuitive controls from our App, our scoreboard provided real-time updates and easy operation, ensuring accurate and timely scorekeeping throughout each game. From the initial concept to the final assembly, our team's dedication and attention to detail resulted in a standout addition to our softball field, enriching the game atmosphere and showcasing our passion for innovation in sports technology.
   
    `}),
  new ProjectHolder({
    title: 'Programming Officer', 
    category: 'Robotics', 
    startDate: 'Sep 2023', 
    endDate: 'April 2024', 
    height: 65,

    images: ['robotics_beaver_logo.png', 'team_61_robot.jpg'],
    text: `
    If you asked anyone what I spent the most time on during high school, BVT FIRST Robotics Team would be the unanimous answer. Beginning of Junior year, I was elected as the Programming Officer for Team 61, and I had my work cut out for me. We began during the summer months, leading into the fall, as we embarked on the ambitious task of building an entire swervedrive system from scratch. With the introduction of new MK4i modules, we faced the challenge of limited support and documentation. Every error and obstacle we encountered became an opportunity for problem-solving and learning. Just as we were finishing a functioning swervedrive system, the build season immmediately started. As the we saw the <a href="https://youtu.be/0zpflsYc4PA?si=pZRHJL697ZmCHFd_" target="_blank">competition release</a> in-person we were debating on how to design our robot to excel in this challenge. After much deliberation, we settled on a two-subsystem design. One subsystem comprised an arm capable of picking up objects from the floor, while the other featured a shooter designed to launch objects into a designated target.
    <br><br>
    As the programming officer, I played a central role in bringing these subsystems to life. Collaborating closely with the mechanical and electrical teams, I developed and implemented the software that controlled our robot's movements and actions. From fine-tuning motor speeds to optimizing sensor feedback, every line of code was crafted with precision and purpose.
  
    Throughout this journey, our <a href="https://github.com/team61/frc-2024-robot/tree/master/src/main/java/frc/robot" target="_blank">GitHub repository</a> served as a central hub for collaboration and version control. It documented our progress, showcased our codebase, and facilitated seamless communication among team members.

    Our efforts culminated in a successful competition season, where our robot performed admirably on the field. Though our robot wasn't the best on the field, robotics is more than just a rank number it's the culmination of months of hard work, dedication, and teamwork, that makes the experience special. Ultimately, this team I've been apart of for four years shows the power of computing and exhibits that when multiple disciplines come together, we can make something exceptional.


    `}),
  new ProjectHolder({
    title: 'Lead Programmer',
    category: 'Drone Club',
    startDate: 'Oct 2023',
    endDate: 'Jun 2023', 
    height: 35,

    images: ['drone_open_cv.png', 'python.png'],
    text: `
    As the lead programmer at drone club, I spearheaded our efforts in a challenging competition where precision and accuracy were paramount. Our task was to fire at balloons based on QR codes they displayed, popping them in sequence to advance. Leveraging Python's OpenCV library, I devised a computer vision solution to locate and read the QR codes in real-time. By processing images in grayscale and at a reduced size, we optimized performance and accuracy. Odometry values guided our drone into position, ensuring precise alignment for each shot. Despite the complexities posed by balloons of varying colors, which sometimes confounded the QR code recognition, our perseverance paid off. Ultimately, our team's dedication and strategic programming enabled us to secure a commendable second-place finish at nationals.
    `}),
  new ProjectHolder({
    title: 'Co-Founder', 
    category: 'Programming Club', 
    startDate: 'Sep 2022', 
    endDate: 'May 2024', 
    height: 40,

    images: ['acsl.png', 'usaco.jpg'],
    text: `
    When freshman year came to a close and sophomore year started I was disappointed to rarely see programming ever again. That’s when a couple of my computer science enthusiasts decided to create a club where we can learn about this outside of class. We felt a need for this because we believed that not only IT students wanted to code. Once we had enough planning, fundraising, and the thumbs up from our club committee we were confident and pitched during the club fair. We were able to attract almost 50 students who were interested to learn programming. 
    <br><br>
    We were excited to see so many people show up but also nervous because we didn’t expect this many to show up. We had to move and expand to two classrooms for our new club. We gave lectures on advanced and simple computer science topics for programming veterans and novices alike. We gave challenging yet interesting problems to all levels of programming. We gave videos/resources for everyone to learn outside the club. For beginners, we gave them courses that work towards certifications so they can sharpen their programming knowledge everyday. For the advanced members, we enrolled in various team competitions for everyone to stay engaged. 
    <br><br>
    Everyday after school we were all improving in our own way and by the end of junior year many of us participated and few of us even won in many state and national level programming competitions, and our team placed Top 5 in Massachusetts in American Computer Science League. Personally, I qualified for Nationals in the American Computer Science League and was the USA Computing Olympiad Silver Medalist. This passion of sharing knowledge is why I decided to pursue an internship with Thinkland AI, where I could teach and guide even more people everyday. 



    `}),
  new ProjectHolder({
    title: 'Thinkland AI', 
    category: 'Internship', 
    startDate: 'Sep 2022',
    endDate: 'Oct 2023',
    height: 60,

    images: ['thinkland_ai.jpg', 'thinkland_python_ai.png', 'thinkland_ai_algorithms.png'],
    text: `Following my internship at SRAVEO, I accepted to work at Thinkland AI as a Computer Science Instructor. My role had me teaching Python, Java, and AI courses to teenagers and kids alike. I was in charge of delivering the presentations using many interactive methods and Q&A's for students to grasp the concepts. During this time I organized a fun coding comeptiton where kids could compete against each other to complete mini-challenges based on their course (Java/Python). Overall, it was very enjoyable and fulfilling seeing my students progress throughout the course. In total I taught over 100+ classes with 300+ diverse students.`
  }),
  new ProjectHolder({
    title: 'Being The Change', 
    category: 'Outreach', 
    startDate: 'Sep 2022', 
    endDate: 'May 2024', 
    height: 100, 

    images: ['robotics_judges_award.jpg'], 
    text: `
    Throughout the past four years being on my FIRST Robotics Team, I have learned how important outreach is and I have learned these core values: Respect, Community, Inclusion, Innovation, and Achievement. Respect is fundamental to our interactions within and outside the team. We respect diverse perspectives, fostering an environment where every member's voice is valued. This year we have worked closely with Pathfinder Tech, where we donated parts and I’ve provided much technical guidance to their rookie FIRST team, reflecting our commitment to treating others with dignity and supporting their journey in STEM. 
    <br><br>
    Community is at the heart of our team's mission. We actively engage with our local community, forging connections with senior centers, libraries, and other organizations. We share our passion for STEM by actively engaging in our 13 sending towns from Blackstone Valley Tech exemplifying our dedication to our local community. This year our team has expanded to a global scale and our team is incredibly proud and fond of our donation of electronics supplies to a school and fellow FIRST team from Worcester, South Africa. Through connections in our own school, our team was able to get in contact with educators and students from Zwelethemba High School who had been visiting Worcester, Massachusetts for a FIRST Tech Challenge competition. Through their awe-inspiring story, I personally donated a thousand dollars and our team and school decided to donate several thousands of dollars in equipment to their team and school so they could start an electronics class. Additionally, we donated a VEX robotics kit to allow them to further explore the possibilities of robotics. 
    <br><br>
    Inclusion is a guiding principle that shapes our team culture. We celebrate diversity and strive to create an inclusive environment where everyone feels welcome and valued. Through our outreach efforts, we reach out to individuals of all ages and backgrounds, inspiring them to explore STEM fields and discover their potential. Our engagement with the Special Olympics and the CABI School reflects our efforts to break down systematic barriers and our approach to collaborating with diverse organizations to promote STEM education and inclusion. Through our dedication to innovation, we strive to make a meaningful impact in the world and inspire others to pursue excellence in STEM fields. 
    <br><br>
    Innovation drives our team's projects and initiatives. We embrace creativity and push the boundaries of what is possible. Our assistive technology projects, such as the communication watches and hydration alert adviser. This year’s project focuses on creating a set of watches for a family of hearing-impaired individuals that will aid in their ability to communicate within their house. Last year, we produced another device called the Hydration Alert that aimed to alert a group of Hispanic farmers when they needed to drink water after working for long periods of time. Both products truly capture the foundation of our team and how we assist our community. 
    <br><br>
    Achievement is the culmination of our team's hard work and dedication. Our commitment to achievement is evident in our annual attendance at SNEAC and our ongoing efforts to advocate for STEM funding and support. Through our collective achievements, this past year through our ambitious goals in helping many organizations and passing on STEM to the next generation we have been award FIRST most prestigious award, the FIRST Impact Award which honors the team that best represents models for other teams and is determined through the team that had the most measurable impact on its community.      
    `
  
  }),
  new ProjectHolder({
    title: 'Areas of Interest', 
    category: 'CS Skills', 
    startDate: 'Aug 2021', 
    height: 0,

    images: ['']
  }),
  new ProjectHolder({
    title: 'NURC Impact', 
    category: 'Robotics', 
    startDate: 'Apr 2018', 
    endDate: 'Mar 2020', 
    height: 0, // Arena, Logo, Hachathon S

    images: ['']
  }),
  new ProjectHolder({
    title: 'Track Race Clock', 
    category: 'Robotics', 
    startDate: 'Aug 2023', 
    endDate: 'Jan 2024', 
    height: 100,

    images: ['track_and_field_race_clock.jpg'],
    text: `Creating a track and field race clock was not just a project for me; it was a passion project born out of necessity and a desire to enhance the sporting experience for my athletes. As a cross country and track and field captain, I understood the importance of precision timing in races and the impact it can have on performance.
    <br><br>
    The idea for the race clock came to me during a track fundraiser when I realized that we were just a few purchases away from acquiring a track and field clock. Though I was disappointed I took matters into my hands, drawing inspiration from an <a href="images/race_clock_idea.jpeg" target="_blank">Arduino post</a> I came across during the summer, I envisioned using two Arduino microcontrollers to simulate the starting gun and accurately recording race times at the finish line. One Arduino would be responsible for starting the stopwatch, mimicking the signal of the starting gun on the track, while the other would receive and display the finishing times.
    
    To ensure precise timing and accurate lane detection, I incorporated ultrasonic sensors into the design. These sensors would detect the presence of athletes in each lane as they crossed the finish line, allowing the system to record their times accordingly.
    
    The data collected by the microcontrollers would then be transmitted to a local website hosted on my laptop, where it could be displayed for all athletes and spectators to see. This real-time display would provide instant feedback to the athletes, allowing them to gauge their performance and make adjustments as needed.
    <br<br>
    Despite successfully creating a working prototype, our efforts to further develop and implement the race clock were hindered by strict guidelines set forth by the MIAA (Massachusetts Interscholastic Athletic Association). However, the experience gained from this project was invaluable. It not only deepened my understanding of Arduino programming but also deepend my love and passion for microcontroller systems.`
  }),
  new ProjectHolder({
    title: 'Blackstone Valley Tech', 
    category: 'Education', 
    startDate: 'Sep 2020', 
    endDate: 'May 2024', 
    height: 60,

    images: ['blackstone_valley_top_down.jpg', 'bvt_logo.png'],
    text: `
    Growing up in an environment where both my parents hailed from technical backgrounds exposed me to computers and coding from a young age. From tinkering with basic programs to understanding the intricacies of operating systems, I found myself drawn to the world of technology. As I transitioned into middle school, my fascination with robotics and programming deepened, I found myself spending hours experimenting with coding projects. This led me to make the pivotal decision of attending a vocational high school with a specialized focus in Information Technology. This decision was because I wanted to immerse myself in an environment where I could explore my passion, and dig deeper in the field.
    <br><br>
    That's why I decided to attend Blackstone Valley Tech in Upton, MA where I majored in Information Technology. Many people don’t know what IT really is. It’s the intersection between hardware and software where you learn about programming, hardware & software, networking, and cybersecurity. This reflects my passion for uncovering the unique intersection between software and hardware, having a holistic understanding of computing. Rather than merely skimming the surface of one discipline, I am driven by the desire to unravel the complexities of the machines we rely on daily. After all, comprehending the technolgoies we engage for hours on end proves both invaluable and endlessly captivating. In this ever-evolving landscape of Information Technology, where innovation reigns supreme embracing a comprehensive education that delves deep into the core of computing offers boundless opportunities for discovery and growth.`
  }),
  new ProjectHolder({
    title: 'Credentials', 
    category: 'Certifications', 
    startDate: 'Mar 2022', 
    height: 40,

    images: ['comptia.png', 'pcap.png', 'testout.png'],
    text: `These are a list of the certifications I've earned throughout my journey. 
    <br><br>
    Programming:
    <br>
    • PCAP - Certified Associate in Python Programming
    <br>
    • JSE – Certified Entry-Level JavaScript Programmer
    <br><br>
    Information Technology:
    <br>
    • CompTIA Network+
    <br>
    • CompTIA A+
    <br>
    • AWS Certified Cloud Practitioner
    <br>
    • IT Academy: Cloud and Virtualization Concepts
    <br>
    • IT Academy: Network Virtualization Concepts
    <br>
    • IT Academy: Software Defined Storage Concepts
    <br>
    • Fortinet NSE 3 Network Security Associate
    <br>
    • Testout Network Pro 
    <br>
    • TestOut PC Pro
    `
  }),
  new ProjectHolder({
    title: 'Daustin Inc.', 
    category: 'Server Build', 
    startDate: 'Oct 2021',
    endDate: 'Jan 2022',
    height: 50,

    images: ['daustin.png', 'build.jpg'], 
    text: `I embarked on the project of assembling a server tailored to meet the game development and testing requirements of Daustin Inc.'s employees. With a modest budget of $600, I crafted a list of components, leveraging the provided CPU, RAM, and water cooler. This server, adaptable to PC functionalities as per Daustin Inc.'s dynamic needs, stands poised to support their gaming endeavors seamlessly. My careful planning and resource allocation ensured an cost-effective yet efficient solution.
    <br><br>
    Throughout the assembly process, I encountered several challenges that tested my problem-solving skills. Wrestling with the intricacies of installing a water cooling unit, grappling with stuck screws, and navigating the constraints of my budget, particularly in balancing the investment between crucial components like the M.2 drive and hard drive. Despite these challenges, I persevered, successfully procuring, documenting, and assembling the server. Furthermore, I diligently installed and configured Windows Server 2019, tailored to the specific requirements of Daustin Inc., while optimizing performance through driver installations. In retrospect, this project not only equipped me with technical expertise but also instilled invaluable lessons in budgetary management, <a href="https://valleytechk12maus-my.sharepoint.com/:f:/g/personal/249081_valleytech_k12_ma_us/EtF_nBmNDuFKniW7Kz6GntEBVaISqXb7Cb1DDyeq6orSXg?e=XGmSGr">documentation</a>, and server configuration, enriching my collective skill set for future endeavors.

    
    
    
    
    
    
    `
  }),
  new ProjectHolder({
    title: 'Smart Home', 
    category: 'Arduino', 
    startDate: 'Apr 2021', 
    endDate: 'Jun 2021', 
    height: 50,

    images: ['arduino.png', 'arduino_smart_home.png'],
    text: `
    During my freshman year of high school, our capstone project was to make a functional IoT device and I decided to make a smart home. This project served to deepen my understanding of Arduino programming and its practical applications. I started by simply controlling RGB LEDs. Then I set up a buzzer for home security alerts. After that I set up a servo door and implemented a multipin passcode security system for door access. For extra security, I added RFID tag to go along with the PIN showcasing the potential for multi-factor authentication in smart home applications. This project not only expanded my technical capabilities but also deepened my appreciation for the versatility and potential of IoT technologies when integrated with Arduino.
   
    `
  }),
  new ProjectHolder({
    title: 'SRAVEO LLC.', 
    category: 'Internship', 
    startDate: 'June 2022', 
    endDate: 'Aug 2022', 
    height: 65,

    images: ['sraveo.png', 'sraveo_events.png'],
    text: `One of the main takeaways from 2022 was my internship at SRAVEO. Over the course of the 3 months,  I collaborated closely with the team to develop a <a href="https://www.sraveo.com/" target="_blank">website</a> using Weebly. My primary responsibility was to craft a simple yet intuitive user interface that streamlined the process for clients to request various audio, photo, video, and livestreaming services for their events. Additionally, I implemented features allowing clients to easily access and review past events executed by SRAVEO, enhancing transparency and trust in the company's services. This internship not only provided me with hands-on experience in website development but also instilled in me the importance of user-centric design principles and effective communication in delivering a website.`}),
  new ProjectHolder({
    title: 'My Hopes', 
    category: 'Future Plans', 
    startDate: 'May 2024', 
    height: 35,

    text: `This section is blank. That's intentional.
    <br><br>
    I know what the fundamentals of what I want to do are - be an engineer that teaches people directly and indirectly - but I don't have any real plans. Of course, on the surface level it seems like being a teacher would be an easy choice, but counterintuitively I don't think being a day-to-day teacher is my calling. Regardless of what I choose, my hope is I find something my passion can speak to and I apply the same mindset to it as I did all the other projects here: give my most to them and see what comes next.`
  }),
];

function insertBoxes () {
  const pairHolderHTML = '<div class="w3-col l3 m6 s12"></div>';
  const octetHolderHTML = '<div class="w3-row-padding main-holder"></div>';
  const boxes = $('#boxes');

  let currentPair;
  let currentOctet;
  for (let i = 0; i < projects.length; i++) {
    if (!(i % 8)) {
      currentOctet = $(octetHolderHTML);
      boxes.append(currentOctet);
    }

    if (!(i % 2)) {
      currentPair = $(pairHolderHTML);
      currentOctet.append(currentPair);
    }

    const project = projects[i];
    project.setIndex(i);
    if (i === 3) {
      project.$elem.addClass('logo-border-tl');
    }
    if (i === 12) {
      project.$elem.addClass('logo-border-br');
    }
    currentPair.append(project.$elem);

    project.start();
  }
}

insertBoxes();

function openModal () {
  $('#modal, #modal-background, #main-circle, #top-bar').addClass('modal-active');
  $('#modal').fadeIn(FADE);
  resetModalImages();
}

function closeModal () {
  $('#modal').fadeOut(FADE);
  $('#modal, #modal-background, #main-circle, #top-bar').removeClass('modal-active');
}

function openProject (event) {
  const elem = event.currentTarget;
  const project = projects[$(elem).attr('index')];
  project.setModalContent();
}

const about = new ProjectHolder({
  title: 'About Me',
  subtitle: 'Soumith Portfolio',
  images: ['senior_picture.jpg'],
  $elem: mainCircle,
  text: `Hi, my name is Soumith Madadi. Ever since a young age, my deep interest in science and technology has driven my pursuit to take on fun and challenging engineering projects that honed my skills to turn my computer science hobby into my profession. Along the way, I’ve found the best way to apply my skills is to use projects to teach and inspire younger people, so my goal is to use my work to become the representation I wish to see in the world. This website is all about some of those projects, along with what I’m currently working on and what I hope to do next.
  <br><br>
  Feel free to reach out to me at <a href="mailto:madadi.soumith@gmail.com">madadi.soumith@gmail.com</a> if you have any questions, comments, or suggestions.
  <br><br>
  <span style="text-align: center; display: block"><strong>Proficient Coding Languages:</strong><br>Python, Java, CSS, HTML, JavaScript, &amp; Arduino
  <br><br>
  <strong>Engineering Areas of Interest:</strong><br>Artificial Intelligence, Computer Vision, Robotics, Automation, UI Design, &amp; Website Development
  <br><br>
  <a href="https://github.com/Soumith-Madadi"><img src="images/github.png" alt="GitHub" style="height: 50px;"></a>\
  <a href="https://www.linkedin.com/in/soumith-madadi-a8038b233"><img src="images/linkedin.png" alt="Linkedin" style="height: 50px;"></a></span>`,
});

function openAbout () {
  about.setModalContent();
}

function resetModalImages () {
  showModalImage(0);
  slideChangeInterval = setInterval(() => shiftModalImage(1, false), 7000);
}

function shiftModalImage (n, pause) {
  showModalImage(slideIndex += n, pause);
}

function showModalImage (n, pause = true) {
  if (pause) {
    clearInterval(slideChangeInterval);
  }
  const dots = $('.modal-image-dot').toArray();
  slideIndex = n < 0 ? dots.length - 1 : n % dots.length;

  $('.modal-image').each((i, image) => {
    $(image)[i === slideIndex ? 'fadeIn' : 'fadeOut'](FADE);
    $(dots[i])[i === slideIndex ? 'addClass' : 'removeClass']('w3-black');
  });
}

function setCircleImage (showIII) {
  circleImageIII = showIII === undefined ? !circleImageIII : showIII;
  const nextImage = circleImageIII ? 'url("images/soumith_suit.jpg")' : 'url("images/am.svg")';
  mainCircle.css('background-image', nextImage);
  mainCircle.css('background-size', circleImageIII ? '100%' : '95%');
}

function startCircleSpin () {
  const animate = () => {
    let picChanged = false;
    const currTrans = mainCircle.unwrap()[0].style.transform || '0';
    const currentDeg = parseInt(/\d+/.exec(currTrans)[0]);
    mainCircle.animate({'transform: rotateY': currentDeg > 90 ? 0 : 180}, {
      duration: 3000,
      progress: (_, percent) => {
        if (percent > 0.5 && !picChanged) {
          picChanged = true;
          setCircleImage();
        }
      }
    });
  };
  animate();
  spinInterval = setInterval(animate, 10000);
}

function stopCircleSpin () {
  clearInterval(spinInterval);
  mainCircle.stop();
}

function mainHoverStart () {
  $('#modal-background').addClass('modal-active');
  stopCircleSpin();
  setCircleImage(false);
  mainCircle.css('transform', 'rotateY(180deg)');
}

function mainHoverEnd () {
  $('#modal').hasClass('modal-active') ? null : $('#modal-background').removeClass('modal-active');
  startCircleSpin();
}

function expandImage () {
  const image = $(`.modal-image:nth-child(${slideIndex + 1})`).attr('src');
  $('#large-image').attr('src', image);
  $('#large-image-background, #large-image, #large-image-close').addClass('modal-active');
  $('#large-image, #large-image-close').fadeIn(FADE);

}

function shrinkImage () {
  const image =  $('#large-image').attr('src');
  $('#large-image, #large-image-close, #large-image-close').fadeOut(FADE);
  $('#large-image-background, #large-image').removeClass('modal-active');

}

$('.project-holder').click(openProject);
mainCircle.click(openAbout);
$('#modal-background').click(closeModal);

$('#main-circle, #top-bar').hover(mainHoverStart, mainHoverEnd);

$('#large-image-background, #large-image').click(shrinkImage);

$(window).resize(() => {
  projects.forEach(project => project.resize())
});

$.Tween.prototype.init = function(elem, options, prop, end, easing, unit) {
  this.elem = elem;
  this.prop = prop;
  this.easing = easing || jQuery.easing._default;
  this.options = options;
  if (prop.startsWith('transform')) {
    this.prop = 'transform';
    this.type = prop.substr(11);
    this.unit = 'deg';
  }
  else {
    this.unit = unit || (jQuery.cssNumber[prop] ? '' : 'px');
  }
  this.start = this.now = this.cur();
  this.end = end;
}
$.Tween.prototype.init.prototype = $.Tween.prototype;

$.Tween.propHooks._default = {
  
  cssPrefixes: ['Webkit', 'Moz', 'ms'],
  emptyStyle: document.createElement('div').style,
  vendorProps: {},
  vendorPropName: function (name) {

    // Check for vendor prefixed names
    var capName = name[0].toUpperCase() + name.slice(1),
      i = this.cssPrefixes.length;
  
    while (i--) {
      name = this.cssPrefixes[i] + capName;
      if (name in this.emptyStyle) {
        return name;
      }
    }
  },

  finalPropName: function (name) {
    var final = jQuery.cssProps[name] || this.vendorProps[name];
  
    if (final) {
      return final;
    }
    if (name in this.emptyStyle) {
      return name;
    }
    return this.vendorProps[name] = this.vendorPropName(name) || name;
  },

  get: function(tween) {
    var result;

    // Use a property on the element directly when it is not a DOM element,
    // or when there is no matching style property that exists.
    if (tween.elem.nodeType !== 1 ||
      tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
      return tween.elem[tween.prop];
    }

    if (tween.prop === 'transform') {
      const currTrans = tween.elem.style.transform || '0';
      result = parseFloat(/\d+/.exec(currTrans)[0]);
    }
    else {
      // Passing an empty string as a 3rd parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails.
      // Simple values such as "10px" are parsed to Float;
      // complex values such as "rotate(1rad)" are returned as-is.
      result = jQuery.css(tween.elem, tween.prop, '');
    }

    // Empty strings, null, undefined and "auto" are converted to 0.
    return !result || result === 'auto' ? 0 : result;
  },

  set: function (tween) {
    if (jQuery.fx.step[tween.prop]) {
      jQuery.fx.step[tween.prop](tween);
    }
    else if (tween.elem.nodeType === 1 && (
      jQuery.cssHooks[tween.prop] || tween.elem.style[this.finalPropName(tween.prop)] != null)) {
        if (tween.prop === 'transform') {
          jQuery.style(tween.elem, tween.prop, `${tween.type}(${tween.now}deg)`);
        }
        else {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        }
    }
    else {
        tween.elem[tween.prop] = tween.now;
    }
  }
}

startCircleSpin();