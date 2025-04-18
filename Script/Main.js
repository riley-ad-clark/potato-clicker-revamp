"use strict";

		//Creating the Counter 
		const counter = new Counter("counter", "pps", "Message Box", 'Reward Box', "Achievement Box", "Reward Box");
		
		//// Creating below a Button object corresponding to each Button created above
		//BigPotato
		const bigPotato = new ClickingButton("HoneyComb", counter);
		
		//The 4 types of buildings
		const building1 = new BuildingButton("Farm", counter, 50, 1);
		const building2 = new BuildingButton("Food truck", counter, 5000, 5);
		const building3 = new BuildingButton("Chips factory", counter, 50000, 50);
		const building4 = new BuildingButton("Potato cloner", counter, 200000, 250);
		
		//The 4 types of building upgrades
		const upgrade1 = new UpgradeButton("Harvester", counter, 5000, 2, building1);
		const upgrade2 = new UpgradeButton("Poutine maker", counter, 50000, 2, building2);
		const upgrade3 = new UpgradeButton("Instant fryer", counter, 500000, 2, building3);
		const upgrade4 = new UpgradeButton("Advanced DNA", counter, 2000000, 2, building4);
		
		//Creating the 5 types of bonus buttons and adding them to the counter

		// Old bonuses are commented out below
		// counter.addBonusButton(new BonusButton("Sweet Potato Bonus", counter, 2, 10));
		// counter.addBonusButton(new BonusButton("Red Potato Bonus", counter, 3, 15));
		counter.addBonusButton(new BonusButton("HoneyPot", counter, 5, 20));
		// counter.addBonusButton(new BonusButton("Blue Potato Bonus", counter, 7, 25));
		// counter.addBonusButton(new BonusButton("Yukon Gold Bonus", counter, 10, 30));