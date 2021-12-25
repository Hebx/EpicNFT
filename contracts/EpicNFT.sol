// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

//import OpenZeppelin Contracts
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

//Inherit the Contract we Imported/ Acess to the Inherited Contract's Methods
contract EpicNFT is ERC721URIStorage {
	// Magic of OpenZeppelin to keep track of tokenIDS
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIDs;

	string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
	string lastSvg = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

	string[] firstWords = ["Human", "Elf", "Dwarf", "Mage", "Witcher", "Elder", "Wizard", "Druid"];
	string[] secondWords = ["OF"];
	string[] thirdWords = ["Nilfgaarde", "Cintra", "Kaer Morhen", "Temeria", "Rivia", "Skellige", "Gryffindor", "HufflePuff", "RavenClaw", "Slytherin"];

	string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];
	event NewEpicNFTMinted(address sender, uint256 tokenID);
	// We Pass the name of our NFT Token and it's symbol
	constructor() payable ERC721 ("Hebx NFT", "Hebx") {
		console.log("EpicNFT");
	}
	// randomly pick a word from each array
	function pickRandomFirstWord(uint256 tokenID) public view returns (string memory) {
		// seed the random generator
		uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenID))));
		// squash the # between 0 and the length of the array to avoid going out of bounds
		rand = rand % firstWords.length;
		return firstWords[rand];
	}
	// randomly pick a word from each array
	function pickRandomSecondWord(uint256 tokenID) public view returns (string memory) {
		// seed the random generator
		uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenID))));
		// squash the # between 0 and the length of the array to avoid going out of bounds
		rand = rand % secondWords.length;
		return secondWords[rand];
	}
	// randomly pick a word from each array
	function pickRandomThirdWord(uint256 tokenID) public view returns (string memory) {
		// seed the random generator
		uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenID))));
		// squash the # between 0 and the length of the array to avoid going out of bounds
		rand = rand % thirdWords.length;
		return thirdWords[rand];
	}

	function pickRandomColor(uint256 tokenID) public view returns (string memory) {
		uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenID))));
		rand = rand % colors.length;
		return colors[rand];
	}

	function random(string memory input) internal pure returns (uint256)
	{
		return uint256(keccak256(abi.encodePacked(input)));
	}

	function getTotalNFTsMinted () external view returns (uint256) {
		return _tokenIDs.current() - 1;
	}
	// function our user will hit to get the NFT
	function makeAnEpicNFT() public {
		// get the current tokenID, this starts at 0
	uint256 newItemID = _tokenIDs.current();
	require(newItemID < 51, "Only 50 NFTs to be minted max!");
		// randomly grab one word from each of the three arrays
		string memory first = pickRandomFirstWord(newItemID);
		string memory second = pickRandomSecondWord(newItemID);
		string memory third = pickRandomThirdWord(newItemID);
		string memory combinedWord = string(abi.encodePacked(first, second, third));

		string memory randomColor = pickRandomColor(newItemID);

		// concatenate it all together then close the <text> and <svg> tags.
		string memory finalSvg = string(abi.encodePacked(baseSvg, randomColor, lastSvg, combinedWord, "</text></svg>"));
		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "',
						// we set the title of our NFT as the generated Word
						combinedWord,
						'", "description": "Veni Vidi Vici", "image": "data:image/svg+xml;base64,',
						// we add data:image/svg+xml;base64, and then append our base64 encode our svg.
						Base64.encode(bytes(finalSvg)),
						'"}'
					)
				)
			)
		);
		// prepend data:application/json;base64, to our data
		string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,", json));
		console.log("\n-------------");
		console.log(
			string(
				abi.encodePacked(
					"https://nftpreview.0xdev.codes/?code=",
					finalTokenURI
				)
			)
		);
		console.log("-------------\n");

		// mint the NFT to the sender using msg.sender
		_safeMint(msg.sender, newItemID);
		// set the NFTs Data
		_setTokenURI(newItemID, finalTokenURI);
		// increment the counter when the NFT is minted
		_tokenIDs.increment();
		// see when the NFT has been minted and to who
		console.log("an NFT w/ ID %s has been minted to %s", newItemID, msg.sender);
		emit NewEpicNFTMinted(msg.sender, newItemID);
	}
}
