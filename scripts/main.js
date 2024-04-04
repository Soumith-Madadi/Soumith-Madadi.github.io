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
    appInsights.trackEvent({name: 'OpenProject', properties});
    if (!ProjectHolder.openedOrder[this.index]) {
      ProjectHolder.opened++;
      appInsights.trackEvent({name: 'OpenOrder', properties: {...properties, order: ProjectHolder.opened}});
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
    startDate: 'Mar 2010', 
    endDate: 'Aug 2014', 
    height: 50,

    images: ['ACC.svg', 'Tank.png'],
    text: `My journey through the world of computer science began unexpectedly when I was 12 years-old and looking for ways to pay for materials I needed to build a small machine I wanted to create. Because I had recently received my first phone and learned how lucrative app development was, my interest was piqued, and I decided to attempt making a mobile game. There was just one problem with this lofty project: I had no clue how to start. Teaching myself how to code was an arduous task; I scoured through different online forums, studied countless YouTube videos, and sunk hours into trial and error. As I learned more about the coding process, my motivation to continue working switched from simply making money to knowing I would receive bits of joy from overcoming every challenge coding presented.
    <br><br>
    A few years later and a couple of released games in, I began development on a follow-up with greater ambitions. What began as an experiment to see if I could create a game with procedurally generated levels, this new project expanded into a full game with several dozen levels and multiple gameplay modes based on the simple top-down tank shooter genre. Developing a game of this increased scaled required me to teach myself how to code in the LUA programming language and the basics of Adobe Illustrator to create the graphics. My second game, Tank, was released in July of 2012 on the Apple App store for iPhones and iPads and the Google Play store for Android devices. Since this game's primary audience is young children, I tried to implement game design principles and graphics that favor straightforward game mechanics and intuitive controls. Over the game's lifespan, it had amassed over 50,000 downloads with one third of those being 0.99¢ purchases before the app was made free.`
  }),
  new ProjectHolder({
    title: 'The Third Build', 
    category: 'YouTube Channel', 
    startDate: 'Dec 2020', 
    height: 50,

    images: ['TTB.svg', 'TTB.gif'],
    text: `Since many of my normal avenues for building projects and teaching others couldn’t happen during COVID, at the end of 2020 I was eagerly looking to find new places to do so. I figured a simple way to encompass both ideas was creating a YouTube channel, The Third Build, where “I try to build cool things and teach others how to make them too”. So far, my videos have included topics from <a href="https://github.com/aed3/LightPanels">building custom lights out of cardboard</a> to <a href="https://github.com/aed3/PS4-esp32">using a PlayStation controller to control robots with an Arduino</a>. And, of course, there’s Future Sight AI too.
    <br><br>
    With every video, I try to focus on these three goals:
    <br>
    1. Increase representation in the engineering community
    <br>
    2. Improve at talking into a camera
    <br>
    3. Include tasks I’m fine with putting less effort towards in the day
    <br><br>
    I’m slowly but surely achieving those goals (although that last one is constantly broken), and the best way for you to learn more is to <a href="https://www.youtube.com/channel/UCdwshbwxNBoCCBoZGgf3U6Q">check it out yourself!</a>`,
  }),
  new ProjectHolder({
    title: 'Football Formation Detection', 
    category: 'Computer Vision', 
    startDate: 'Oct 2019', 
    endDate: 'Mar 2020', 
    height: 65,

    images: ['Football-02.png', 'Football.gif'],
    text: `During my senior year, Northwestern’s Football Team was looking for CS majors for a special project, and as a passionate school football fan, I looked to sign up. The project’s goal was to develop a program that can watch post-game footage of Northwestern playing defense, pinpoint the location every player on the field, and determine the formation of the opposing team. At this point, I already had some computer vision experience (see the lacrosse robot project below), but it was clear completing this project would far outpace any I’d done before.
    <br><br>
    Over Fall and Winter quarter, I adopted the project as my own and managed to count the work as class credit to give it the time required to see it through. My approach started by calculating the angle of the camera relative to the field by finding the field lines using computer vision techniques through OpenCV. This must be done remove any distortion caused by the camera’s perspective and identify where the action is on the field. While that is processing, my machine learning model running - through TensorFlow trained on finding football players - identified their locations on the field. Once both parts are finished, the data is put together to transform their positions to a 2D plane representing a virtual field, offensive players are sorted into positions groups, and a set of rules determine which formation the offense is in. 
    <br><br>
    After my 4 months of working on this, I had a practically finished project on my hand (the animation on here is an example of it running) with the only some of the formations not yet programmed in. As a bonus, the program was optimized enough to accomplish complete formation detection on live video at 30 fps. To be clear, it won’t be used during games as that would be cheating. But, to be completely frank, because I had to hand off the project during the chaos that was March 2020, I don’t know if they’re using it at all. I would’ve loved to see them get use of it, but even if they haven’t, the heaping amount of experience this project gave me will certainly be put to good use.`
  }),
  new ProjectHolder({
    title: 'Club President',
    category: 'Robotics',
    startDate: 'Apr 2018',
    endDate: 'Mar 2020', 
    height: 35,

    images: ['NURC_2.jpg', 'NURC.jpg', 'NURC_3.jpg'],
    text: `If you asked anyone what I spent the most time on during college, Northwestern’s Robotics Club would be the unanimous answer. Starting at the end of sophomore year, I was elected as club president and had my work cut out for me. When I joined earlier that year, the club was far from reaching its full potential in ambition and scale. Therefore, I made it my mission to give Northwestern an engineering club that lives up to its name. But, don’t get me wrong, this was far from a solo effort. I had the pleasure of finding and working with some fantastic leaders, and I knew if I achieved my first goal of motivating them to find creative outreach and organization methods, we would go far.
    <br><br>
    Over my 2-year tenure, our club grew from 12 members to at most 100, became involved in community outreach programs in and around Chicago, secured over $50,000 - 6x our annual budget - in grants and sponsorships, gained the respect of administrators and other organizations alike, acquired another club, and <strong>actually finished</strong> projects. The best part about that list is that’s not even half of it!
    <br><br>
    Many of the projects on this site are directly related to and only happened because of my dedication to this club. Those go into more detail about my specific contributions, and because of them and all the wonderful “builders” I got to work with, all the effort I put it to this organization was made worth it. All I could’ve asked for more is to see what our most significant events would’ve been yet if COVID didn’t happen. But alas, everything that did happen is still more than enough to make my time there unforgettable.`
  }),
  new ProjectHolder({
    title: 'Campus Heart', 
    category: 'Web Development', 
    startDate: 'Jun 2016', 
    endDate: 'Sep 2016', 
    height: 40,

    images: ['CH.png'],
    text: `From the stress and confusion of my own college application process, the desire to ease the pain of applying to college for future students led me to create CampusHeart.com: a place for students to learn what they need to follow their heart. Creating this website from scratch required me to learn and use HTML, CSS, JavaScript, PHP, and SQL for the first time and put my UI design research to the test. Sadly, I let the website fall into disarray during college, but I do plan on revitalizing it with my new skills soon! In the meantime, here are some of its key features:
    <br><br>
    <strong>Research</strong>
    <br><br>
    Covering everything from the amount of students in a specific major to sports facilities open on campus, Campus Heart contains over 1500 data points worth of information to help students find their future home. Campus Heart's software helps you sort through the data and find what matters by sifting the information through judicious formulas and allowing students to rate the factors that are important to them.
    <br><br>
    <strong>Compare</strong>
    <br><br>
    Students can put their top choices head-to-head and see which school aligns more to what they want. Using the student’s preferences on which factors within 12 different categories matter most, each school receives an overall compatibility score to quickly see which school aligns most with them. And, if a college they care about is not in Campus Heart's system yet, they can add their own data and get results.
    <br><br>
    <strong>Apply</strong>
    <br><br>
    Students can put their top choices head-to-head and see which school aligns more to what they want. Using the student’s preferences on which factors within 12 different categories matter most, each school receives an overall compatibility score to quickly see which school aligns most with them. And, if a college they care about is not in Campus Heart's system yet, they can add their own data and get results.`
  }),
  new ProjectHolder({
    title: 'My Current Job', 
    category: 'Microsoft', 
    startDate: 'Aug 2020',
    height: 60,

    images: ['MSFT.jpg', 'EX.png', 'MSFT.svg'],
    text: `Following my internship at the company in 2019, I accepted my offer to return as a full-time software engineer. My current role has me working with the Microsoft Excel team, specifically the team in charge of the code for creating charts. Although the team is within Excel, this is the same code used for creating charts in Word, PowerPoint, and other Office applications. Over the year of working here, my tasks have all involved bringing functionality currently only available on the desktop version of Excel to the version of Excel you use in your browser.
    <br><br>
    Personally, it’s been great working on a product I already used daily, especially since having an innate perspective of a consumer goes a long way. Also, knowing the changes I’m making improves potentially 100s of millions of people’s online experience is fulfilling. Let’s be honest, no large tech company is perfect: far from it. But I have been elated working for Microsoft as my experience has shown me they undoubtably care about their employees. Of all the places I could’ve landed after college, I couldn’t be more grateful this is where it was.`
  }),
  new ProjectHolder({
    title: 'Being The Change', 
    category: 'Outreach', 
    startDate: 'Sep 2018', 
    endDate: 'Mar 2020', 
    height: 100, 

    images: ['OT.jpg', 'OT_2.jpg', 'OT_3.jpg'], 
    text: `As a minority in STEM, I am constantly reminded of the total lack of diversity in the field when at every computer science class or event I go to I can almost count the amount of people who look like me on one hand. This realization occurred very early on into my journey, and I just could not accept being almost the only one of my black friends, family, or acquaintances interested in science. The chance soon arose in high school to be part of that change as I was invented to present at a seminar about the importance of science for black middle schoolers and discuss my mobile game development process. Even though every other presenter was at least twice my age, the audience overwhelming said my presentation was their favorite because our small age difference made me relatable enough to inspire.
    <br><br>
    This experience opened my eyes so much to the amount of real change I could make to lower the STEM’s racial divide that there was no way I could make this a onetime event. Continuing throughout high school, I would find ways to volunteer and teach, but not in the true engineering capacity I was looking for until I made my own way through Robotics Club. I knew that the NSBE - National Society of Black Engineers - chapter I was a member of would know of potential opportunities, so I created a partnership between the two clubs to improve both of our outreach missions. The first involved a local high school they worked with so on a weekly basis I and some Robotics Club members would volunteer to help their black students build robots for their FIRST robotics competition. The second was having my club participate their "A Walk for Education Event" where we hosted an interactive presentation for K-12 students from undeserved communities looking to learn about STEM. Along with these, we had local libraries and elementary schools asking if us to do demonstrations or our projects and we took every opportunity we could. Those just might have been my favorite part of the work I did for the club as not only seeing their faces light up but also them asking questions about how the robots they just saw or used worked took my whole heart. Igniting people to have experiences like that is all I'm here for, so it was about time a club I ran not only made our own event, but also took it to another level.
    <br><br>
    Our plan, which was known as “Robotics Day”, would’ve started with us bringing ~80 high school students to learn how to build projects out of Arduino kits we were giving to them and ended with a community wide event where we demoed our various fighting robots. The potential impact of this was higher than anything we’d been a part of, but there was one problem; it was scheduled for April 18th, 2020. Of all the events COVID canceled I would've personally done, this one, hands down, is most heartbreaking. Right now, my hope is that they take the planning and make the event a reality when it's safe to do so, but until then, I am far from done finding ways to carry the spirit of that event in what I do.`
  }),
  new ProjectHolder({
    title: 'Areas of Interest', 
    category: 'CS Skills', 
    startDate: 'Aug 2021', 
    height: 0,

    images: ['Skills.svg']
  }),
  new ProjectHolder({
    title: 'NURC Impact', 
    category: 'Robotics', 
    startDate: 'Apr 2018', 
    endDate: 'Mar 2020', 
    height: 0, // Arena, Logo, Hachathon S

    images: ['NURCI.jpg', 'NURC.svg', 'NURCI_2.jpg']
  }),
  new ProjectHolder({
    title: 'Virtual Reality', 
    category: 'Robotics', 
    startDate: 'Dec 2019', 
    endDate: 'Jan 2020', 
    height: 100,

    images: ['VR.gif'],
    text: `One of Robotics Club’s original project, the virtual reality robot had the goal of building a robotic arm that can match the movement of a human controlling it through a VR headset. Over time, the club lost interest in the project, and by the end of my first year as president, there was no one working on it at all. This did not set well with me or the club’s other president, especially because the more we thought about it, the more we realized there isn’t relatively much needed to pull it off. Between my computer knowledge and her mechanical knowledge, we figured us working on it might be enough to get the project done quickly. So, us, along with the club’s treasure, set aside the week before Winter break to either finish the project or put it in the club’s review mirror.
    <br><br>
    Despite not knowing anything about coding for a VR headset or mechanical arm motion ahead of time, we managed to pull it off. It wasn’t as straight forward as we thought since inverse kinematics is no joke for newcomers, but it was super satisfying achieving a goal others gave up on in such a short amount a time and the <a href="https://www.instagram.com/p/B7ACsaRh8Jz/" target="_blank">full video of the first working test</a> very much shows it. We did make a few changes to the robot and its code after that first week to allow people to use the arm without wearing the headset and control the arm remotely. The main reason I’m mentioning this project is because we finished this right before doing several outreach events and discovered this arm’s greatest use getting others interested in robots. This always drew the most interest wherever we took it which was only aided by its interactivity. Those interactions ranged from letting the arm quickly switch between users so people could watch their actions directly influence it or the stress inducing fun of someone across town trying to perform an action while audience members give them instructions (having a room full of kids scream at you through a video call: not ideal).`
  }),
  new ProjectHolder({
    title: 'Northwestern University', 
    category: 'Education', 
    startDate: 'Sep 2016', 
    endDate: 'Jun 2020', 
    height: 60,

    images: ['NU.svg', 'NU_2.svg', 'NU_3.jpg'],
    text: 'For college, I attended Northwestern University in Evanston, IL where I double majored in engineering and graduated with a Bachelor of Science in Computer Science and in Computer Engineering. Many people don’t know the difference between those degrees and the most straightforward way I’ve found describe it is computer science is about the programs which run on a computer while computer engineering is about the computer itself. My decision to double major on both sides of the computer spectrum stems from my enjoyment of finding the unique connections between software and hardware so both parts of the computing experience thrive. I could’ve stuck with one major and learned about the other on the side, but having an education which thoroughly taught me how a machine, especially one we use for hours every day, works all the down seemed too useful and interesting to pass up.'
  }),
  new ProjectHolder({
    title: 'Lacrosse Robot', 
    category: 'Robotics', 
    startDate: 'Oct 2017', 
    endDate: 'Mar 2020', 
    height: 40,

    images: ['LAX.png'],
    text: `The project I originally joined Robotics Club to work on, the lacrosse goalie robot is a mechanical goalie that attempts to catch lacrosse balls flying towards it at 75mph. That travel speed, along with the short distance the ball can be shot from, makes this project tricky as not only do you have to build a robot that can start and stop moving at high speed to reach its target, but also need fast enough code that can find the ball before it reaches the goal. 
    <br><br>
    My first leadership role in the club was as its project lead where my main objective was to coordinate between the software and hardware sides of the project and determine what our next steps should be. Outside of generally running the project, my work was mainly in writing computer vision code. This involved using C++ and the OpenCV library to process images from two cameras on separate threads at 60fps, determine an object's change in position in 3D space based on the differences in the ball’s placement between the two camera feeds, locate its final position relative to the robot using its acceleration and velocity to predict its trajectory, and send the correct rotation for the motors to spin so the catcher lined up with the ball. Near the end of my time on the project, I attempted to make a machine learning model trained from footage of lacrosse balls flying from the same perspective the robot would have had which yielded much better results than the computer vision alone.
    <br><br>
    Now, there's a reason why this is just a diagram rather than a picture of a robot and that’s because, despite all I could do for the rest of the club, the most important project to me always struggled to get done. One of the biggest reasons comes from this project always attracting many times the people who wanted to work on the code than the hardware and I struggled to balance the workload between the two sides without having people, including myself, who aren’t mechanically inclined trying to build something so complex. That issue was finally solved right before my senior year, but, if you read any other section, you can probably guess why it’s still not done. The final prototype was planned to be built during the Spring quarter of that year, so COVID made swift work of preventing that. In all honesty, I don't think we would've finished it in time even if everything went to plan, but I think with the passion of "wanting to see the project I joined this club for finished before I leave", we would've gotten close.`
  }),
  new ProjectHolder({
    title: 'Future Sight AI', 
    category: 'Machine Learning', 
    startDate: 'Apr 2020',
    height: 50,

    images: ['FSAI.svg', 'FSAI_2.png', 'FSAI_3.png', 'FSAI.gif'],
    text: `Despite its worldwide popularity, few people know underneath the veil of a kid’s game, Pokemon is one of the most complex two player strategy games out there. So, when quarantine last year dumped a ton of time on my hands, I decided this was my chance at making a competitive Pokemon AI. 
    <br><br>
    This led to the creation of what I’ve named “Future Sight AI”, a program that learns to play Pokemon like a human and at a competitive level. The AI can determine how likely it is to win at the end of a given turn and use that information to rank the paths a move choice can take it down. This method, looking at turns in advance and choosing the ones most favorable to you, is the same one used by the best chess-playing AIs, and now those same techniques can be applied to Pokemon.
    <br><br>
    However, unlike chess, Pokemon is a game that involves random chance, information unavailable to both players, and a highly variable set of "pieces" (a.k.a. Pokemon) and their potential moves. These additional factors make creating an AI for this game in this way significantly more difficult to complete and interesting to solve. Despite those challenges, the result of the application is an AI that more than matches human play and can climb the rankings on Pokemon Showdown to become one of the top 5% of players in the most popular competitive format.
    <br><br>
    I couldn’t scratch the surface of what goes into it here, so I made a <a href="https://youtu.be/rhvj7CmTRkg">video on The Third Build</a> to explain the key parts of how it works and use this project to teach others the computer science principles I used to achieve this. `
  }),
  new ProjectHolder({
    title: 'Northwestern Mutual', 
    category: 'Internship', 
    startDate: 'Jun 2018', 
    endDate: 'Aug 2018', 
    height: 50,

    images: ['NM.png'],
    text: `Located in Milwaukee, Wisconsin, Northwestern Mutual is a nationwide life insurance company insurance over 4 million people. With about one third of the company's employees working in the technology field, there was plenty of room for me to grow and learn how professionals work during my 10 weeks there during the Summer.
    <br><br>
    I had the opportunity to work directly under one of the company’s senior software engineers as he assigned me my daily tasks, taught me how to deploy code changes and additions I made, and delivered insight into industry standards for software development. My main task over the Summer was to improve the front-end and back-end of an internal application used to locate the company’s 75 different offices around the country used by their financial representatives. The program began as someone needing to update its data manually whenever an office’s information changed, therefore the back-end portion of my work including remodeling a Java program using Spring Boot to run SQL queries on the database which contains the up-to-date data, restructure received data into JSON format, and deliver the JSON files to web-application when it loads so its data updates automatically. I was then set to work on fixing bugs within the Google Maps based web-application by editing its JavaScript and using the Google Maps API documentation as a guide. With the bugs squared away, my supervisor asked me to implement a set of new features the representatives had requested and was allowed to add some features I thought useful when I finished the given task early.`
  }),
  new ProjectHolder({
    title: 'Microsoft', 
    category: 'Internship', 
    startDate: 'Jun 2019', 
    endDate: 'Sep 2019', 
    height: 65,

    images: ['Office.png', 'Office_2.png'],
    text: `The main takeaway from 2019 was my summer internship at Microsoft. For 3 months, I worked at their Redmond, WA headquarters on a sub-team of Microsoft Excel focused on Office Add-ins. My work focused around enabling Office Add-in functionality while the user is offline since they are effectively websites which work inside Office applications. The first half of my time there was creating a demo what's possible with offline add-ins, and I chose to make the Wikipedia add-in work offline. The result, which can be found <a href="https://github.com/OfficeDev/Office-Apps/tree/WikipediaOffline" target="_blank">here on GitHub</a> allows users to navigate 1000s of previously visited and predicted future articles while offline while taking less than 50MB of the user's storage. It works by saving pages past pages using the Service Worker API and looking at the links within the currently opened page to decide which links to cache as part of the predicted future pages. My work on it also led to improving load times while the user was online by at least 150 times.
    <br><br>
    The second part of my job was to implement a system to install the data Office Add-ins needed for offline use during their initial install on all Microsoft Office Applications. I was able to finish the new feature and have it added the internal preview build before my internship was done. Along with that, I spent some time writing tutorials for add-in developers on how to use browser storage techniques to access data while offline and helping a PM intern with her project by writing test to prove her ideas worked.`
  }),
  new ProjectHolder({
    title: 'My Hopes', 
    category: 'Future Plans', 
    startDate: 'Aug 2021',
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
  appInsights.trackEvent({name: 'CloseProject', properties: ProjectHolder.currentProjectProps});
}

function openProject (event) {
  const elem = event.currentTarget;
  const project = projects[$(elem).attr('index')];
  project.setModalContent();
}

const about = new ProjectHolder({
  title: 'About Me',
  subtitle: 'Albert III Portfolio',
  images: ['ProfilePhoto.jpg'],
  $elem: mainCircle,
  text: `Hi, my name is Albert III. Ever since a young age, my deep interest in science and technology has driven my pursuit to take on fun and challenging engineering projects that honed my skills to turn my computer science hobby into my profession. Along the way, I’ve found the best way to apply my skills is to use projects to teach and inspire younger people, so my goal is to use my work to become the representation I wish to see in the world. This website is all about some of those projects, along with what I’m currently working on and what I hope to do next.
  <br><br>
  Feel free to reach out to me at <a href="mailto:aed@thethirdbuild.com">aed@thethirdbuild.com</a> if you have any questions, comments, or suggestions.
  <br><br>
  <span style="text-align: center; display: block"><strong>Proficient Coding Languages:</strong><br>Bash, C, C++, CSS, HTML, Java, JavaScript, &amp; PowerShell
  <br><br>
  <strong>Engineering Areas of Interest:</strong><br>Artificial Intelligence, Computer Vision, Robotics, UI Design, &amp; Website Development
  <br><br>
  <a href="https://github.com/aed3"><strong>GitHub Account</strong></a></span>`,
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
  const nextImage = circleImageIII ? 'url("images/third.png")' : 'url("images/am.svg")';
  mainCircle.css('background-image', nextImage);
  mainCircle.css('background-size', circleImageIII ? '80%' : '95%');
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

  appInsights.trackEvent({name: 'OpenImage', properties: {...ProjectHolder.currentProjectProps, image}});
}

function shrinkImage () {
  const image =  $('#large-image').attr('src');
  $('#large-image, #large-image-close, #large-image-close').fadeOut(FADE);
  $('#large-image-background, #large-image').removeClass('modal-active');

  appInsights.trackEvent({name: 'CloseImage', properties: {...ProjectHolder.currentProjectProps, image}});
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