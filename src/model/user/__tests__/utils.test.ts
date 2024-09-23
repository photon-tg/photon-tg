import { subtractTime } from '@/utils/date';
import { getPassiveIncome } from '@/model/user/utils';
import { UserPhotoFragment } from '@/gql/graphql';

describe('getPassiveIncome', () => {
	const mockBasePhoto: UserPhotoFragment = {
		__typename: 'user_photos',
		id: '123',
		created_at: subtractTime(new Date().toUTCString(), { hours: 1 }),
		photo_id: '321',
		url: '',
		level_at_time: 1,
	};
	it('should successfully calculate empty photos', () => {
		const emptyPhotos: UserPhotoFragment[] = [];
		const lastHourlyRewardYesterday = subtractTime(new Date(), { days: 1 });

		const passiveIncome = getPassiveIncome(
			emptyPhotos,
			lastHourlyRewardYesterday,
		);
		expect(passiveIncome).toBe(0);
	});

	it('should correctly calculate passive income for 1 photo', () => {
		const emptyPhotos: UserPhotoFragment[] = [mockBasePhoto];
		const lastHourlyRewardYesterday = subtractTime(new Date().toUTCString(), {
			hours: 1,
		});
		const passiveIncome = getPassiveIncome(
			emptyPhotos,
			lastHourlyRewardYesterday,
		);
		expect(passiveIncome).toBe(50);
	});

	it('should correctly calculate passive income for 2 photos and different levels', () => {
		const hourAndHalfFromNow = subtractTime(new Date().toUTCString(), {
			hours: 1,
			minutes: 31,
			seconds: 5,
		}); // 76
		const threeHoursFromNow = subtractTime(new Date().toUTCString(), {
			hours: 3,
		}); // 300
		const photo1 = { ...mockBasePhoto, created_at: hourAndHalfFromNow };
		const photo2 = {
			...mockBasePhoto,
			created_at: threeHoursFromNow,
			level_at_time: 2,
		};
		const emptyPhotos: UserPhotoFragment[] = [photo1, photo2];
		const lastHourlyRewardYesterday = subtractTime(new Date().toUTCString(), {
			hours: 3,
			minutes: 30,
		});
		const passiveIncome = getPassiveIncome(
			emptyPhotos,
			lastHourlyRewardYesterday,
		);
		expect(passiveIncome).toBe(376);
	});

	it('should correctly calculate passive income for photos taken before last passive income claim', () => {
		const twoHoursFromNow = subtractTime(new Date().toUTCString(), {
			hours: 2,
		}); // 100
		const photo1 = { ...mockBasePhoto, created_at: twoHoursFromNow };
		const emptyPhotos: UserPhotoFragment[] = [photo1];
		const lastHourlyRewardYesterday = subtractTime(new Date().toUTCString(), {
			hours: 1,
		});
		const passiveIncome = getPassiveIncome(
			emptyPhotos,
			lastHourlyRewardYesterday,
		);
		expect(passiveIncome).toBe(50);
	});

	it('should not allow to claim more than 3 hours of passive income', () => {
		const fiveHoursFromNow = subtractTime(new Date().toUTCString(), {
			hours: 5,
		}); // 500
		const photo1 = {
			...mockBasePhoto,
			created_at: fiveHoursFromNow,
			level_at_time: 2,
		};
		const onePhoto: UserPhotoFragment[] = [photo1];
		const lastHourlyRewardYesterday = subtractTime(new Date().toUTCString(), {
			hours: 4,
			minutes: 25,
		});
		const passiveIncome = getPassiveIncome(
			onePhoto,
			lastHourlyRewardYesterday,
		);
		expect(passiveIncome).toBe(300);
	});
});
