class Person
{
    firstName;
    lastName;
    age; // Because it's supposed to be there, even though it never gets used

    constructor(sFirst, sLast) // Constructor to set the first and last name of a new Person object
    {
        this.firstName = sFirst;
        this.lastName = sLast;
    }
}

class Contestant extends Person
{
    numberOfGamesPlayed; // Keeps track of the number of games each contestant has played
    totalNumberOfGuesses; // Keeps track of the total number of guesses in all the games played by a user
    aoGamesPlayed; // Array of GamesPlayed objects

    constructor(sFirst, sLast, iAge) // Constructor calls receives attributes from parent class, then intializes this class's attributes
    {
        super(sFirst, sLast, iAge);

        this.numberOfGamesPlayed = 0;
        this.totalNumberOfGuesses = 0;
        this.aoGamesPlayed = [];
    }
    
    showResults()
    {   
        var iLength = this.aoGamesPlayed.length; // Gets the length of the aoGamesPlayed array
        var bHasFinishedaGame = false; // The function should only return the number of guesses if the contestant has completed a game, so this variable is intialized as false
        var iGuessesFinishedGames = 0; // This variable will track the number of guesses from each game that is complete
        var sMessage = "";
        for (var iCounter = 0; iCounter < iLength; iCounter++) // Loops through the aoGamesPlayed array for the contestant
        {
            if (this.aoGamesPlayed[iCounter].finishedGame) // Checks if each game in the array of games played was finished
            {
                bHasFinishedaGame = true; // If it was finished, then the function now knows to return the number of guesses
                iGuessesFinishedGames = iGuessesFinishedGames + (this.aoGamesPlayed[iCounter].guessCount); // The number of guesses from that game is added to the running total
            }
        }
        var sFullName = this.getFullName(); // Call the getFullName method to get the full name of the contestant
        if (bHasFinishedaGame)
        {
            sMessage = sFullName + " has made " + iGuessesFinishedGames + " guesses"; 
            return sMessage.bold(); // If any of the games in the array were completed, the method will return this message
        }
        else
        {
            sMessage = sFullName + " has not finished a game";
            return sMessage.bold(); // If none of the games in the aoGamesPlayed array were finished, this message will be displayed
        }
    }

    getFullName()
    {                
        return (this.firstName) + " " + (this.lastName);
    }

}

class GamesPlayed
{
    constructor() // Constructor does not receive parameters, but intializes the attributes
    {
        this.guessCount = 0;
        this.finishedGame = false;
    }
}

function ResetMe()
{
    localStorage.clear(); // clear out localStorage
    aoContestants = [];// clear out array aoContestants
    var sCharAvailable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\',/!.\"-"; // reload available characters string
    var sCharUsed = ""; // clear out used characters string
    // After resetting the form, make play again buttons disappear, so the user doesn't try to play again with same user and skip the name entering part of the code
    document.getElementById("btnPlayAgainSame").style.display = "none";
    document.getElementById("btnPlayAgainDiff").style.display = "none";
    // Then reset the rest of the values, so the page looks like it does when it is first loaded
    document.getElementById("btnPlayGame").style.display = "block";
    document.getElementById("displayTitleName").style.display = "none";
    document.getElementById("titleNote").style.display = "none";
    document.getElementById("titleHeader").style.display = "none";
    document.getElementById("inputLetter").value = "";
    document.getElementById("finalGuess").value = "";
    document.getElementById("fsAvailable").style.display = "none";
    document.getElementById("fsUsed").style.display = "none";
    document.getElementById("fsPlay").style.display = "none";
}

function titleCase(str) 
{
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

function playGame(bGetName)
{   
    // Code to pick the song randomly from the array is here so that every time the user plays, they get a new title 
    // This array contains the songs with spaces removed
    
    // A random number is chosen within the indicies of the songs array
    var  iArrayIndex = getRndInteger(0, (asSongs.length - 1))
    // The random number is used to assign the song title to a variable
    sSongTitle = asSongs[iArrayIndex];
    iTitleLength = sSongTitle.length
    // This loop creates a new variable that is the same length as the song, with all the characters replaced by "_"
    sHiddenTitle = "";
    for (var iCounter = 0; iCounter < iTitleLength; iCounter++)
    {
        if (sSongTitle.charAt(iCounter) != " ") {
            sHiddenTitle += "_";
        }
        else
        {
            sHiddenTitle += " ";
        }
    }
    // This assigns the "____" title to the p tag
    document.getElementById("displayTitleName").innerHTML = sHiddenTitle.bold();
    // This if statement checks to see if the it is a new or returning user and therefore if it should collect name info
    if (bGetName)
    {
        var sFirstName = "";
        var sLastName = "";
        while (sFirstName == "") // While loops ensure the user can't continue without entering anything
        {   
            sFirstName = prompt("Enter your first name: ");
            sFirstName = titleCase(sFirstName);
        }
        while (sLastName == "") // While loops ensure the user can't continue without entering anything
        {
            sLastName = prompt("Enter your last name: ");
            sLastName = titleCase(sLastName);
        }
        // New Contestant object is created and pushed to the end of the aoContestants array
        var oContestant = new Contestant(sFirstName, sLastName);
        aoContestants.push(oContestant);
    }
    // New GamesPlayed object is created and pushed to the end of that contestant's aoGamesPlayed array
    var oGamesPlayed = new GamesPlayed();
    aoContestants[(aoContestants.length - 1)].aoGamesPlayed.push(oGamesPlayed);
    // Play game button disappears and all the other divs appear so the user can play!
    document.getElementById("btnPlayGame").style.display = "none";
    document.getElementById("btnPlayAgainSame").style.display = "none";
    document.getElementById("btnPlayAgainDiff").style.display = "none";
    document.getElementById("displayTitleName").style.display = "block";
    document.getElementById("titleNote").style.display = "block";
    document.getElementById("titleHeader").style.display = "block";
    document.getElementById("fsAvailable").style.display = "block";
    document.getElementById("fsUsed").style.display = "block";
    document.getElementById("fsPlay").style.display = "block";
    // Cursor is put in the inputLetter input element
    document.getElementById("inputLetter").focus();
    // Scrolls so user can see the title they are trying to guess and the input box
    document.getElementById("titleHeader").scrollIntoView(true);
}

function guessChar()
{
    sCharGuess = document.getElementById("inputLetter").value.toUpperCase(); // Converts every guess to upper case so that case doesn't matter
    if (sCharGuess.length == 1) // This will catch a user if they try to press the guess button without entering anything
    {
        var sPossChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\',()/!.\"-";
        var iCharPossible = sPossChars.search(sCharGuess);
        if (iCharPossible != -1) // This will catch a user if they try to enter something that's not from the available characters
        {
            var iCharAvailIndex = sCharAvailable.search(sCharGuess)
            if (iCharAvailIndex != -1) // // This will catch a user if they try to enter a charater they have already entered
            {
                sCharAvailable = sCharAvailable.replace(sCharGuess, ""); // Remove the character from the available characters
                document.getElementById("availableChars").innerHTML = sCharAvailable.bold(); // Update p tag
                sCharUsed = sCharUsed + sCharGuess; // Add character to the used characters list
                document.getElementById("usedChars").innerHTML = sCharUsed.bold(); // Update p tag
                var iCountChar = 0;
                for (var iIndex = 0; iIndex < iTitleLength; iIndex++) // Checks each charater in the title to see if it matches the character guessed
                {
                    if (sSongTitle.charAt(iIndex).toLowerCase() == sCharGuess.toLowerCase()) // If the chracter is in the title, it changes the "_" to the character
                    {
                        sHiddenTitle = sHiddenTitle.replaceAt(iIndex, sCharGuess);
                        document.getElementById("displayTitleName").innerHTML = sHiddenTitle.bold();
                        iCountChar += 1;
                    }
                }
                if (iCountChar == 0) // If the character is never found, a message tells the user this
                {
                    alert("Your character was not found in the song title.")
                }
                else // If the character is found, it tells the user how many times
                {
                    alert("Congratulations, \"" + sCharGuess + "\"" + " was found " + iCountChar + " time\(s\)!")
                }
                // Increment guessCount for that Contestants game in the GamesPlayed array
                var contestant = aoContestants[(aoContestants.length - 1)];
                contestant.aoGamesPlayed[(contestant.aoGamesPlayed.length - 1)].guessCount += 1;
            }
            else
            {
                alert("That character was already guessed.");
            }
        }
        else
        {
            alert("Your guess is invalid, please choose from the available characters.")
        }
    }
    else
    {
        alert("Your guess must be at least one character.");
    }
    document.getElementById("inputLetter").select(); // Select the contents of the input box
    document.getElementById("titleHeader").scrollIntoView(true); // Scroll so the title is still visible
    checkWin(sHiddenTitle); // checks to see if the user guessed all the characters
}

function getRndInteger(min, max) // Function to choose a random integer between two numbers
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}

String.prototype.replaceAt = function(iIndex, sReplace) // Function to replace characters in a string
{
    return this.substr(0, iIndex) + sReplace + this.substr(iIndex + sReplace.length);
}

function checkWin(sTitle)
{
    if (sTitle.toLowerCase() == sSongTitle.toLowerCase()) // Checks if all the letters have been guessed
    {
        var iGuessCount = aoContestants[(aoContestants.length - 1)].aoGamesPlayed[(aoContestants[(aoContestants.length - 1)].aoGamesPlayed.length - 1)].guessCount;
        if (iGuessCount < 26) // If they had less then 26 guesses, this is displayed
        {
            alert("You solved it with " + iGuessCount + " guesses!")
        }
        else // If they had more than 26 guesses, this is displayed
        {
            alert("You solved it, but you took too many guesses (" + iGuessCount + ").")
        }
        // Code that's executed once a game is over to increment values and reset strings:
        var contestant = aoContestants[(aoContestants.length - 1)];
        contestant.totalNumberOfGuesses += iGuessCount;
        contestant.aoGamesPlayed[(contestant.aoGamesPlayed.length - 1)].finishedGame = true;
        contestant.numberOfGamesPlayed += 1;
        sCharAvailable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\',/!.\"-"; 
        sCharUsed = "";
        document.getElementById("availableChars").innerHTML = sCharAvailable.bold();
        document.getElementById("usedChars").innerHTML = sCharUsed.bold();
        // Clear out input boxes
        document.getElementById("inputLetter").value = "";
        document.getElementById("finalGuess").value = "";
        document.getElementById("fsAvailable").style.display = "none";
        document.getElementById("fsUsed").style.display = "none";
        document.getElementById("fsPlay").style.display = "none";
        document.getElementById("titleNote").style.display = "none";
        // Display the play agin buttons
        document.getElementById("btnPlayAgainSame").style.display = "block";
        document.getElementById("btnPlayAgainDiff").style.display = "block";
    }
}

function finalGuess()
{   
    var sTitle = document.getElementById("finalGuess").value
    if (sTitle.toLowerCase() == sSongTitle.toLowerCase()) // Checks if the guess matches the title
    {
        aoContestants[(aoContestants.length - 1)].aoGamesPlayed[(aoContestants[(aoContestants.length - 1)].aoGamesPlayed.length - 1)].guessCount += 1; // If they are correct, only increment guessCount by one
        // Display the whole title without "_"
        document.getElementById("displayTitleName").innerHTML = sSongTitle.toUpperCase().bold();         
        var iGuessCount = aoContestants[(aoContestants.length - 1)].aoGamesPlayed[(aoContestants[(aoContestants.length - 1)].aoGamesPlayed.length - 1)].guessCount;
        if (iGuessCount < 26) // If they had less then 26 guesses, this is displayed
        {
            alert("You solved it with " + iGuessCount + " guess(es)!")
        }
        else // If they had more than 26 guesses, this is displayed
        {
            alert("You solved it, but you took too many guesses (" + iGuessCount + ").")
        }
        // Code that's executed once a game is over to increment values and reset strings:
        var contestant = aoContestants[(aoContestants.length - 1)];
        contestant.totalNumberOfGuesses += iGuessCount;
        contestant.aoGamesPlayed[(contestant.aoGamesPlayed.length - 1)].finishedGame = true;
        contestant.numberOfGamesPlayed += 1;
        sCharAvailable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\',/!.\"-"; 
        sCharUsed = "";
        document.getElementById("availableChars").innerHTML = sCharAvailable.bold();
        document.getElementById("usedChars").innerHTML = sCharUsed.bold();
        // Clear out input boxes and reset strings
        document.getElementById("inputLetter").value = "";
        document.getElementById("finalGuess").value = "";
        document.getElementById("fsAvailable").style.display = "none";
        document.getElementById("fsUsed").style.display = "none";
        document.getElementById("fsPlay").style.display = "none";
        // Display play agin buttons
        document.getElementById("btnPlayAgainSame").style.display = "block";
        document.getElementById("btnPlayAgainDiff").style.display = "block";
    }
    else // If they guessed wrong, increment guessCount by 26
    {
        aoContestants[(aoContestants.length - 1)].aoGamesPlayed[(aoContestants[(aoContestants.length - 1)].aoGamesPlayed.length - 1)].guessCount += 26;    
        alert("Wrong guess, 26 was added to your guess count.");
        document.getElementById("inputLetter").select();
        document.getElementById("titleHeader").scrollIntoView(true);
        document.getElementById("finalGuess").value = "";
    }
}

function showGames()
{   
    var aoContestantsSorted = aoContestants;
    var oObjCopy;
    var sNewString = "";
    var sOutput = "";
    for (var iCounter = 0; iCounter < (aoContestantsSorted.length - 1); iCounter++) // Bubble sort to sort Contestants based on totalNumberOfGuesses
    {
        for (var iCounter2 = 0; iCounter2 < (aoContestantsSorted.length - 1); iCounter2++)
        {
            if ((aoContestantsSorted[iCounter2].totalNumberOfGuesses) < (aoContestantsSorted[(iCounter2 + 1)].totalNumberOfGuesses)) 
            {
                oObjCopy = aoContestantsSorted[(iCounter2 + 1)];
                aoContestantsSorted[(iCounter2 + 1)] = aoContestantsSorted[iCounter2];
                aoContestantsSorted[iCounter2] = oObjCopy;
            }
        }
    }
    for (var iCounter = 0; iCounter < aoContestantsSorted.length; iCounter++) // Loop to make one string with all the Contestants and their number of guesses
    {
        var sFName = aoContestantsSorted[iCounter].firstName;
        var sLName = aoContestantsSorted[iCounter].lastName;
        var sNumGuess = aoContestantsSorted[iCounter].totalNumberOfGuesses;
        sNewString = sFName + " " + sLName + " " + sNumGuess + " guesses" + "<br />";
        sOutput = sOutput + sNewString;
    }     
    // Open a new window and save to local storage                
    window.open("content/gameOutput.html"); 
    localStorage.setItem("newOutput", sOutput);
}
// Declare global variables
var aoContestants = [];
var sSongTitle = "";
var sHiddenTitle = "";    
var sCharAvailable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\',/!.\"-"; 
var sCharUsed = "";
document.getElementById("availableChars").innerHTML = sCharAvailable.bold();
document.getElementById("usedChars").innerHTML = sCharUsed.bold();

var asSongs = ["Don't Stop Believin'",
                "When Doves Cry",
                "Livin' On a Prayer",
                "Don't You Forget About Me",
                "Time After Time",
                "Billie Jean",
                "Pour Some Sugar On Me",
                "Every Breath You Take",
                "I Love Rock 'n Roll",
                "Girls Just Want To Have Fun",
                "Take On Me",
                "Like a Prayer",
                "Eye Of the Tiger",
                "Here I Go Again",
                "I Wanna Dance With Somebody Who Loves Me",
                "With Or Without You",
                "Another One Bites the Dust",
                "Jessie's Girl",
                "Sweet Child O' Mine",
                "Total Eclipse Of the Heart",
                "Everybody Wants To Rule the World",
                "You Shook Me All Night Long",
                "Karma Chameleon",
                "Jack and Diane",
                "Another Brick In the Wall Part II",
                "Flashdance... What a Feeling",
                "Little Red Corvette",
                "Like a Virgin",
                "Careless Whisper",
                "Purple Rain",
                "Beat It",
                "Born In the U.S.A.",
                "Hungry Like the Wolf",
                "Africa",
                "I Want To Know What Love Is",
                "Summer of '69",
                "Tainted Love / Where Did Our Love Go",
                "Love Is a Battlefield",
                "Don't You Want Me",
                "Kiss",
                "Welcome To the Jungle",
                "Wake Me Up Before You Go-Go",
                "Jump",
                "Under Pressure",
                "Walk This Way",
                "Borderline",
                "Down Under",
                "In the Air Tonight",
                "Sweet Dreams Are Made Of This",
                "You Give Love a Bad Name",
                "Faith",
                "Photograph",
                "Call Me",
                "Celebration",
                "Thriller",
                "Faithfully",
                "Bette Davis Eyes",
                "Physical",
                "Stand Back",
                "Holiday",
                "Keep On Loving You",
                "1999",
                "Funkytown",
                "Heaven",
                "Start Me Up",
                "Let's Go Crazy",
                "True",
                "All Night Long All Night",
                "I Can't Go For That No Can Do",
                "Crazy Little Thing Called Love",
                "Come On Eileen",
                "Footloose",
                "The Tide Is High",
                "Love Shack",
                "Walk Like an Egyptian",
                "Dancing In the Dark",
                "What's Love Got To Do With It",
                "I've Had The Time Of My Life",
                "Centerfold",
                "Push It",
                "Man In the Mirror",
                "Nothing's Gonna Stop Us Now",
                "Back In Black",
                "Heaven Is a Place On Earth",
                "Take My Breath Away",
                "Free Fallin'",
                "Need You Tonight / Mediate",
                "Super Freak",
                "These Dreams",
                "Never Gonna Give You Up",
                "Endless Love",
                "Always Something There To Remind Me",
                "Let's Dance",
                "Fast Car",
                "Let the Music Play",
                "Every Rose Has Its Thorn",
                "Do You Really Want To Hurt Me",
                "Whip It",
                "Pink Houses",
                "I Just Called To Say I Love You",
                "Hurts So Good",
                "Kiss On My List",
                "Pride In the Name Of Love",
                "Sexual Healing",
                "Don't Dream It's Over",
                "Hit Me With Your Best Shot",
                "I Just Died In Your Arms",
                "Gloria",
                "Right Here Waiting",
                "Wanted Dead Or Alive",
                "I Still Haven't Found What I'm Looking For",
                "We Are the World",
                "We Got the Beat",
                "Modern Love",
                "Just Like Heaven",
                "The Boys Of Summer",
                "Straight Up",
                "Can't Fight This Feeling",
                "Sister Christian",
                "Saving All My Love For You",
                "Alone",
                "Crazy For You",
                "We Belong",
                "Bust a Move",
                "How Will I Know",
                "Broken Wings",
                "Paradise City",
                "Manic Monday",
                "Walking On Sunshine",
                "Higher Love",
                "I'm So Excited",
                "Father Figure",
                "St. Elmo's Fire Man In Motion",
                "Fool In the Rain",
                "Edge Of Seventeen",
                "Red Red Wine",
                "Where the Streets Have No Name",
                "Greatest Love Of All",
                "Rock You Like a Hurricane",
                "Take Me Home Tonight",
                "Panama",
                "West End Girls",
                "Just the Two Of Us",
                "Sunglasses At Night",
                "The Final Countdown",
                "The Living Years",
                "Every Little Thing She Does Is Magic",
                "You Gotta Fight For Your Right To Party!",
                "It Takes Two",
                "Money For Nothing",
                "Open Arms",
                "Drive",
                "I Feel For You",
                "The Way It Is",
                "Separate Ways Worlds Apart",
                "Take It On the Run",
                "Rock Of Ages",
                "Material Girl",
                "Maneater",
                "Upside Down",
                "Brass In Pocket I'm Special",
                "Head Over Heels",
                "Rock the Casbah",
                "Ride Like the Wind",
                "Everything She Wants",
                "Eyes Without a Face",
                "Wanna Be Startin' Somethin'",
                "So Emotional",
                "Invisible Touch",
                "The Power Of Love",
                "The Way You Make Me Feel",
                "I Ran So Far Away",
                "99 Luftballoons",
                "Our House",
                "Abracadabra",
                "Cars",
                "Arthur's Theme Best That You Can Do",
                "That's What Friends Are For",
                "Hello",
                "If You Leave",
                "All Through the Night",
                "Danger Zone",
                "Easy Lover",
                "Addicted To Love",
                "9 To 5",
                "Heartbreaker",
                "She Blinded Me With Science",
                "One More Try",
                "Against All Odds Take a Look At Me Now",
                "Sledgehammer",
                "Missing You",
                "Out Of Touch",
                "Listen To Your Heart",
                "Oh Sherrie",
                "Rapper's Delight",
                "Mickey",
                "Heat Of the Moment",
                "867-5309/Jenny",
                "That's All",
                "Ghostbusters",
                "Say You, Say Me",
                "She Drives Me Crazy",
                "I Can't Wait",
                "Morning Train Nine To Five",
                "Legs",
                "You Make My Dreams",
                "Wild Thing",
                "Shout",
                "Don't Come Around Here No More",
                "True Colors",
                "Any Way You Want It",
                "Raspberry Beret",
                "Relax",
                "Rock With You",
                "Der Kommissar",
                "Orinoco Flow Sail Away",
                "Baby, Come To Me",
                "Kokomo",
                "We're Not Gonna Take It",
                "It's Still Rock and Roll To Me",
                "Our Lips Are Sealed",
                "The Winner Takes It All",
                "P.Y.T. Pretty Young Thing",
                "Caribbean Queen No More Love On the Run",
                "Glory Days",
                "Twilight Zone",
                "Uptown Girl",
                "I'm On Fire",
                "Up Where We Belong",
                "Burning Down the House",
                "She Works Hard For the Money",
                "Rio",
                "La Isla Bonita",
                "Word Up!",
                "Papa Don't Preach",
                "Do They Know It's Christmas?",
                "Dude Looks Like a Lady",
                "Everybody Have Fun Tonight",
                "Shake It Up",
                "Waiting For a Girl Like You",
                "Hard To Say I'm Sorry / Get Away",
                "Rock Me Amadeus",
                "In Your Eyes",
                "Maniac",
                "Sailing",
                "My Prerogative",
                "I Guess That's Why They Call It the Blues",
                "Lucky Star",
                "Run To You",
                "Cruel Summer",
                "Glory Of Love",
                "White Wedding",
                "All Out Of Love",
                "You Spin Me Round Like a Record",
                "Here Comes the Rain Again",
                "Every Time You Go Away",
                "Open Your Heart",
                "One Moment In Time",
                "The One I Love",
                "Never Tear Us Apart",
                "Waiting For a Star To Fall",
                "Cult Of Personality",
                "If I Could Turn Back Time",
                "Round and Round",
                "Young Turks",
                "Mony Mony",
                "Ebony and Ivory",
                "Back To Life However Do You Want Me",
                "I'm Coming Out",
                "A View To a Kill",
                "Electric Avenue",
                "The Flame",
                "The Rose",
                "Working For the Weekend",
                "Look Away",
                "Live To Tell",
                "Kyrie",
                "Nightshift",
                "On My Own",
                "Express Yourself",
                "Dr. Feelgood",
                "I Knew You Were Waiting For Me",
                "Hold Me Now",
                "Baby, I Love Your Way / Freebird Medley",
                "The Reflex",
                "Owner Of a Lonely Heart",
                "Sign O' the Times",
                "Love Bites",
                "Goody Two Shoes",
                "Nasty",
                "Got My Mind Set On You",
                "Voices Carry",
                "Pump Up the Volume",
                "Queen Of Hearts",
                "Freeway Of Love",
                "The Stroke",
                "Break My Stride",
                "Hey Nineteen",
                "The Look Of Love",
                "Part-Time Lover",
                "Lovesong",
                "Who Can It Be Now?",
                "Pump Up the Jam",
                "Rapture",
                "Cum On Feel the Noize",
                "Janie's Got a Gun",
                "Cherish",
                "Harden My Heart",
                "Your Love",
                "Private Eyes",
                "Hold On To the Nights",
                "Living In America",
                "Let's Groove",
                "Chariots Of Fire - Titles",
                "Human Nature",
                "When I Think of You",
                "King Of Pain",
                "We Didn't Start the Fire",
                "Cold Hearted",
                "No One Is To Blame",
                "U Got the Look",
                "Bad",
                "You Keep Me Hangin' On",
                "Do You Believe In Love",
                "Too Shy",
                "Patience",
                "Vacation",
                "Caught Up In You",
                "Making Love Out Of Nothing At All",
                "I Would Die 4 U",
                "Another Day In Paradise",
                "Hungry Heart",
                "The Longest Time",
                "I Won't Back Down",
                "Shakedown",
                "Talk Dirty To Me",
                "Let's Hear It For the Boy",
                "We Built This City",
                "Shake You Down",
                "Looking For a New Love",
                "Into the Night",
                "The Next Time I Fall",
                "Holding Back the Years",
                "Roll With It",
                "Wishing Well",
                "Only In My Dreams",
                "Just Like Starting Over",
                "Sirius / Eye In the Sky",
                "Miss You Much",
                "I Can Dream About You",
                "Venus",
                "Why Can't This Be Love?",
                "Luka",
                "You're the Inspiration",
                "Mr. Roboto",
                "Candle In the Wind Live 1986",
                "Southern Cross",
                "Tell It To My Heart",
                "Rhythm Of the Night",
                "Theme From Greatest American Hero Believe It or Not",
                "The Lady In Red",
                "Lady",
                "Stuck On You",
                "I'll Be There For You",
                "Wind Beneath My Wings",
                "Touch Of Grey",
                "The Heat Is On",
                "Truly",
                "Lost In Love",
                "Angel Of the Morning",
                "I Need Love",
                "Ain't Nobody",
                "Islands In the Stream",
                "I Keep Forgettin' Every Time You're Near",
                "Let My Love Open the Door",
                "I Want a New Drug",
                "You Are",
                "Smooth Operator",
                "Don't Stand So Close To Me",
                "Never",
                "Give It To Me Baby",
                "Small Town",
                "Sussudio",
                "Lovergirl",
                "Secret Lovers",
                "What You Need",
                "La Bamba",
                "Rosanna",
                "Stand",
                "The Glamorous Life",
                "I've Never Been To Me",
                "Girl You Know It's True",
                "Would I Lie To You?",
                "Don't Worry, Be Happy",
                "Love In an Elevator",
                "Sad Songs Say So Much",
                "Slow Hand",
                "Keep Your Hands To Yourself",
                "Nothin' But a Good Time",
                "Somebody's Baby",
                "Better Be Good To Me",
                "Somebody's Watching Me",
                "What Have You Done For Me Lately",
                "Human",
                "Bad Medicine",
                "Eternal Flame",
                "Stuck With You",
                "Little Jeannie",
                "Smooth Criminal",
                "Save a Prayer",
                "You Can Call Me Al",
                "Angel",
                "Rock This Town",
                "Dirty Laundry",
                "Jump For My Love",
                "Desire",
                "I'm Still Standing",
                "Brilliant Disguise",
                "The Promise",
                "The Safety Dance",
                "Back On the Chain Gang",
                "Sowing the Seeds Of Love",
                "Come Dancing",
                "You Might Think",
                "One Thing Leads To Another",
                "Conga",
                "The Sweetest Taboo",
                "Mad About You",
                "Gypsy",
                "I Know There's Something Going On",
                "Jeopardy",
                "Life In a Northern Town",
                "Time Clock Of the Heart",
                "I'm Alright",
                "You Got It The Right Stuff",
                "Against the Wind",
                "Late In the Evening",
                "Dirty Diana",
                "Let It Whip",
                "Don't Get Me Wrong",
                "Buffalo Stance",
                "At This Moment",
                "I Think We're Alone Now",
                "Sara",
                "You Got It",
                "New Attitude",
                "Dance Hall Days",
                "Private Dancer",
                "Beds Are Burning",
                "Always On My Mind",
                "Hard Habit To Break",
                "Lean On Me",
                "Cherish",
                "Something About You",
                "Steppin' Out",
                "One Night In Bangkok",
                "C'est La Vie",
                "What Have I Done To Deserve This?",
                "Every Little Step",
                "Sweet Love",
                "America",
                "True Faith",
                "Magic",
                "People Are People",
                "It's My Life",
                "Jungle Love",
                "Puttin' On the Ritz",
                "How Am I Supposed To Live Without You",
                "Fame",
                "You Dropped a Bomb On Me",
                "Union Of the Snake",
                "Don't Talk To Strangers",
                "Kids In America",
                "Send Me an Angel",
                "Obsession",
                "What I Am",
                "Genius Of Love",
                "Say Say Say",
                "Chains Of Love",
                "You Better, You Bet",
                "Head To Toe",
                "One",
                "Dress You Up",
                "Straight From the Heart",
                "Little Lies",
                "Automatic",
                "Watching the Wheels",
                "Me Myself and I",
                "I Can't Tell You Why",
                "Being With You",
                "Songbird",
                "Freeze-Frame",
                "How ‘Bout Us",
                "Alive and Kicking",
                "Self Control",
                "Blame It On the Rain",
                "She Bop",
                "I Want Your Sex",
                "Running Up That Hill",
                "Pass the Dutchie",
                "Rock Lobster", 
                "People Are People", 
                "Once in a Lifetime", 
                "Sweet Dreams", 
                "Missionary Man",
                "Safety Dance", 
                "Only a Lad", 
                "Whip It", 
                "99 Red Balloons"]