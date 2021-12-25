const main = async () => {
	const nftContractFactory = await hre.ethers.getContractFactory('EpicNFT');
	const nftContract = await nftContractFactory.deploy({
		value: hre.ethers.utils.parseEther('0.001'),
	});
	await nftContract.deployed();
	console.log("Contract deployed to:",nftContract.address);

	// const svg = `
	// <svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>"Omnia Ab Uno</text>
    // </svg>
	// `

	// let metadata = {
	// 	'name': 'Omnia Ab Uno',
	// 	'description': 'Everything from One',
	// };
	// const tokenURI = encodeTokenURI(svg, metadata);

	// Call the function to mint NFT
	let mint = await nftContract.makeAnEpicNFT();
	// Wait for it to be mined
	await mint.wait();
	console.log("Minted NFT #1")

};
// const encodeTokenURI = (svg, metadata) => {
// 	const base64svg = Buffer.from(svg).toString('base64');
// 	metadata['image'] ='data:image/svg+xml;base64,' + base64svg;
// 	const base64json = Buffer.from(JSON.stringify(metadata)).toString('base64');
// 	return tokenURI = 'data:application/json;base64,' + base64json;
// }

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
