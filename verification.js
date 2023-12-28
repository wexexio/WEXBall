async function lotteryCacl(count, winning, oldList, maxNumber, winNumber) {
	let winList = [...winning];

	let list = [];
	if (count === 0) {
		list = [...oldList];
	} else {
		for (let i = 0; i < oldList.length; i = i + 2) {
			list.push(((oldList[i] + oldList[i + 1]) % maxNumber) + 1);
		}
	}

	const multi = [];
	const single = [];
	list.filter(async (item, index) => {
		const count = list.filter((element) => item === element).length;

		if (winList.indexOf(item) > -1) return;

		if (multi.indexOf(item) === -1 && count > 1) {
			multi.push(item);
		} else if (count === 1) {
			single.push(item);
		}
	});

	if (winList.length + multi.length >= winNumber) {
		winList = [...winList, ...multi.slice(0, winNumber - winList.length)];
		return { winning: winList, multi: multi };
	} else {
		winList = [...winList, ...multi];
	}

	if (multi.length === 0 && winList.indexOf(single[0]) === -1) {
		winList.push(single[0]);
	}

	if (winList.length >= winNumber) {
		return { winning: winList, multi: multi };
	}

	if (list.length == 1) {
		return { winning: winList, multi: multi };
	}

	return await lotteryCacl(count + 1, winList, list, maxNumber, winNumber);
}

async function hashToList(hash, maxNumber) {
	const list = [];

	for (let i = 2; i < hash.length; i = i + 2) {
		const hex = hash.slice(i, i + 2);
		list.push((parseInt(hex, 16) % maxNumber) + 1);
	}
	return list;
}

async function verification(hash) {
	const maxNumber = 40;
	const winNumber = 6;

	console.log(`Block Hash : ${hash}`);

	// hash to List
	const list = await hashToList(hash, maxNumber);
	console.log(`Hash To Number : ${list}`);

	const win = [];
	const { winning, multi } = await lotteryCacl(
		0,
		win,
		list,
		maxNumber,
		winNumber
	);
	console.log(`calculate number : ${winning}`);

	const bonus = winning[winNumber - 1];
	const nubmers = winning.splice(0, winning.length - 1);
	nubmers.sort(function (a, b) {
		if (a > b) return 1;
		if (a === b) return 0;
		if (a < b) return -1;
	});

	console.log(
		`Win Number : ${nubmers[0]}, ${nubmers[1]}, ${nubmers[2]}, ${nubmers[3]}, ${nubmers[4]} + 보너스 ${bonus}`
	);
}

verification(
	"0x5275cdb9372f5402778776d80301e0160c1cadae462400a80f1f0212928d04ae"
);
