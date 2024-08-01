export type IGuitar = {
	id: number;
	name: string;
	image: string;
	description: string;
	price: number;
};

export type ICartItem = IGuitar & {
	quantity: number;
};

// export type GuitarId = {
// 	id: number;
// };

// export type GuitarId2 = Pick<IGuitar, 'id' | 'name'>;

// export type GuitarId3 = Omit<IGuitar, 'name' | 'image'>;

// export type GuitarId4 = IGuitar['id'];
