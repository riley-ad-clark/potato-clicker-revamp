//-----------------------------------------
// REMARKS: This program creates an interactive comb clicker idle game with several components, with the point of
//the game is to increase your pps (comb's per second) and the speed at which you get them. it is a visual
//interactive game with a default 1pps, a big comb you can click to get one comb each time, buildings to increase
//pps, upgrades to multiply how much the pps is increased by the buildings and peroidic Bonsu combs that appear
//every 90 seconds on screen, these comb's add a multiplier to total pps for a certain duration depending on the
//type of comb clicked. there is 3 main aspects of this program, 1. the visual elements handled by the provided
//css and html files
//2. the Button.js file that houses the abstract button class which is what dictates the ability for the user to
//interact with the screen and what result happens with different buttons (button subclasses).
//3. Counter.js which holds the Counter class that handles the games logic, speed of frame updates and pps.
//
//
//-----------------------------------------
"use strict"
class Counter
{
	// CLASS: Counter
	//
	//
	// REMARKS: This class is an overarching logic that handles how the comb's are counted up, the frame rate of the
	//screen, enabling the clickablilty features and other logic needed for the comb clicker game.
	//
	//-----------------------------------------

	//
	//Instance variables
	//
	#count;  //the current amount of combes held
	#name;  //id of the counter in the html file
	#htmlCounter;  //the html element representing the counter
	#htmlCPS;  //the html element representing the pps
	#htmlMessageRewardBox 
	#htmlMessage;  //the html element for showing a message
	#htmlAchievement;  //the html element for showing an achievement
	#htmlRewardBox; // the html element for showing the current reward multiplier
	#rate;  //the pps value
	#multiplier;  //a pps multipler (1 by default)
	#bonusButtonList;  //a list of all BonusButtons
	#moduloTracker;//to keep track of power of 10 achievments

	#bonusButtonIntervalTracker;//count how many bonus buttons there are.

	#bonusInterval;

	#playerData;
	
	//
	//Class constants
	//
	static get #INTERVAL() { return 50; }  //setting the interval to 50 milliseconds
	static get SECOND_IN_MS() { return 1000; }  //one second in milliseconds
	static get DEFAULT_MESSAGE_DURATION() { return 5; }  //in seconds
	static get #BONUS_DURATION_VISIBLE(){return Counter.SECOND_IN_MS * 10 }
	
	//
	//Constructor
	//
	constructor(name, cps, messageBox, messageRewardBox, achievementBox, rewardBox, playerData)
	{
		this.#count = 0;
		this.#name = name;
		this.#htmlCounter = document.getElementById(name);
		this.#htmlCPS = document.getElementById(cps);
		this.#htmlMessage = document.getElementById(messageBox);
		this.#htmlMessageRewardBox = document.getElementById(messageRewardBox);
		this.#htmlAchievement = document.getElementById(achievementBox);
		this.#htmlRewardBox = document.getElementById(rewardBox);

		// Local storage data
		this.#playerData = {
			count: this.#count,
			rate: this.#rate,
		};

		const savedRate = localStorage.getItem("rate");
		const savedCount = localStorage.getItem("count");
		
		this.#rate = savedRate !== null && !isNaN(Number(savedRate)) ? Number(savedRate) : 0;
		this.#count = savedCount !== null && !isNaN(Number(savedCount)) ? Number(savedCount) : 0;

		this.#multiplier = 1;
		this.#initCounter();

		this.#bonusButtonList = [];
		this.#moduloTracker = 10;

		this.#bonusButtonIntervalTracker = 0;
		this.randomBonusInterval();


		this.kachingSound = new Audio('Audio/kaching.mp3');
		this.kachingSound.volume = 0.3;
		this.kachingSound.preload = "auto";

		
	}

	randomBonusInterval(){
		this.#bonusInterval = Math.round(Math.random() * (70 - 30) + 30);
	}
	
	//Top secret...
	cheatCode()
	{
		this.count = 50000000;
		console.log("Cheat code 1 applied successfully");
	}

	cheatCodeTwo(){
		this.count = 10000;
		console.log("Cheat code 2 applied successfully");
	}

	
	
	//Method that regularly updates the counter and pps texts
	//------------------------------------------------------
	// #updateCounter
	//
	// PURPOSE: private method that regularly updates the counter and pps text, effectively keeping up with the main
	//counting logic and frame rate. This method also keeps track of the timing between bonus combs appearing on the
	//screen using the intervals of frame updates. This also updates achievements on every power of 10.
	// PARAMETERS: none
	//
	// Returns: none
	//------------------------------------------------------
	#updateCounter() 
	{
		
		// Introduces localStorage to the picture
		let lsCount = JSON.parse(localStorage.getItem("count"));
		this.#count = lsCount;

		if (lsCount >= 1 || null) {
			const lsRate = JSON.parse(localStorage.getItem("rate"));
			this.#rate == lsRate;
			this.#count += (this.#rate * this.#multiplier) * (Counter.#INTERVAL / Counter.SECOND_IN_MS);

			this.#htmlCounter.innerText = `${Math.round(this.#count)} combs`; // Display the counter
			this.#htmlCPS.innerText = `Combs per second: ${Math.floor(this.#rate * this.#multiplier)} cps`;
			this.#playerData.rate = this.#rate;
			this.#playerData.count = this.#count;
	
			// Set local once per storage per page update
			localStorage.setItem("count", this.#playerData.count);
			localStorage.setItem("rate", this.#playerData.rate);
	
			//prints achievements on powers of 10:
			if(this.#count >= this.#moduloTracker){
				this.showMessage(`${this.#moduloTracker} achieved!`, Counter.DEFAULT_MESSAGE_DURATION,
					true);
				this.#moduloTracker *= 10;
			}
	
			//uses the fact this method handles intervals and converts those to seconds to a create 90 second intervals
			//between bonus combs
			if(this.#bonusButtonIntervalTracker === this.#bonusInterval * Counter.SECOND_IN_MS){
				this.#bonusButtonIntervalTracker = 0;
				this.randomBonusInterval();
				this.#bonusCycle();
			}else{
				this.#bonusButtonIntervalTracker += Counter.#INTERVAL;
			}
		} else {
			this.#count += (this.#rate * this.#multiplier) * (Counter.#INTERVAL / Counter.SECOND_IN_MS);

			this.#htmlCounter.innerText = `${Math.round(this.#count)} combs`; // Display the counter
			this.#htmlCPS.innerText = `Combs per second: ${Math.floor(this.#rate * this.#multiplier)} cps`;
			this.#playerData.count = this.#count;
				
			localStorage.setItem("count", JSON.stringify(this.#playerData.count));
	
			//prints achievements on powers of 10:
			if(this.#count >= this.#moduloTracker){
				this.showMessage(`${this.#moduloTracker} achieved!`, Counter.DEFAULT_MESSAGE_DURATION,
					true);
				this.#moduloTracker *= 10;
			}
	
			//uses the fact this method handles intervals and converts those to seconds to a create 90 second intervals
			//between bonus combs
			if(this.#bonusButtonIntervalTracker === this.#bonusInterval * Counter.SECOND_IN_MS){
				this.#bonusButtonIntervalTracker = 0;
				this.randomBonusInterval();
				this.#bonusCycle();
			}else{
				this.#bonusButtonIntervalTracker += Counter.#INTERVAL;
			}
		}
	}


	//Starting the counter and making sure that it updates every Counter.#INTERVAL milliseconds
	//param: none
	//returns: none
	#initCounter()
	{
		setInterval(this.#updateCounter.bind(this), Counter.#INTERVAL);
	}
	
	//Method that can be used to present a message: 
	//either a regular message (when the achievement parameter is set to false) OR
	//an achievement message (when the achievement parameter is set to true).
	showMessage(theMessage, time=Counter.DEFAULT_MESSAGE_DURATION, achievement = false)  //time is in seconds;
	{
		let theElement = this.#htmlMessage;
		if (achievement){
			theElement = this.#htmlAchievement;
			this.kachingSound.currentTime = 0;
			this.kachingSound.play();
		}
		theElement.innerHTML = theMessage;
		theElement.classList.remove("hidden");
		//The following statement will make theElement invisible again after [time] seconds
		setTimeout(() => {theElement.classList.add("hidden");}, time*Counter.SECOND_IN_MS);
	}

	showMessageReward(theMessage, time=Counter.DEFAULT_MESSAGE_DURATION, achievement = false)  //time is in seconds;
	{
		let theElement = this.#htmlMessageRewardBox;
		if (achievement){
			theElement = this.#htmlRewardBox;
		}

		theElement.innerHTML = theMessage;
		theElement.classList.remove("hidden");
		//The following statement will make theElement invisible again after [time] seconds
		setTimeout(() => {theElement.classList.add("hidden");}, time*Counter.SECOND_IN_MS);
	}


	//increment comb count by amount param
	//param: int amount, increase comb count by that much
	//returns: none
	increment(amount) {
		this.#count += amount;

		// Updates locally stored count whenever HoneyComb is clicked
		localStorage.setItem("count", JSON.stringify(this.#count));
	}

	//increments/updates the rate
	//param: an int called amount which gets added to the #rate.
	//return: none
	updateRate(amount){
		this.#rate += amount;
	}

	//returns comb count
	get count(){
		return this.#count;
	}


	//purpose: randomly selects a bonusButton from the bonus button list, then makes it visible for #BONUS_DURATION_VISIBLE
	//or in other words 10s, then after that has ran out (or the user has clicked the button) the button becomes
	//invisible again
	//param: none
	//return: none
	#bonusCycle(){
		if (this.#bonusButtonList.length === 0) return;//should there be no buttons

		//choose a button
		const index = Math.floor(Math.random() * this.#bonusButtonList.length);
		const choosen = this.#bonusButtonList[index];

		choosen.showButton();//display the button

		setTimeout(() => {choosen.hideButton()}, Counter.#BONUS_DURATION_VISIBLE);//timer to turn off
	}

	//updates the multplier
	//param: an integer input, multiplies the #multiplier
	//return: none
	updateMultiplier(input){
		this.#multiplier *= input;
	}

	//method to push bonus buttons
	//param: bb is a bonus button that gets pushed onto #bonusButtonList.
	//return: none
	addBonusButton(bb) {
		if(bb instanceof BonusButton){
			this.#bonusButtonList.push(bb);
		}

	}
}


