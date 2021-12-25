const main = async () => {
	const nftContractFactory = await hre.ethers.getContractFactory('EpicNFT');
	const nftContract = await nftContractFactory.deploy();
	await nftContract.deployed();
	console.log("Contract deployed to:",nftContract.address);

	// Call the function to mint NFT
	let mint = await nftContract.makeAnEpicNFT();
	// Wait for it to be mined
	await mint.wait();
	// mint another NFT
	mint = await nftContract.makeAnEpicNFT();
	await mint.wait();
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
