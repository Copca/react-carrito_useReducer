/**
 * Acciones
 */
import { db } from '../data/db';
import type { ICartItem, IGuitar } from '../types';

export type CartActions =
	| { type: 'add-to-cart'; payload: { item: IGuitar } }
	| { type: 'remove-from-cart'; payload: { id: IGuitar['id'] } }
	| { type: 'decrease-quantity'; payload: { id: IGuitar['id'] } }
	| { type: 'increase-quantity'; payload: { id: IGuitar['id'] } }
	| { type: 'clear-cart' };

/**
 * State
 */
// Obtnenos los datos de LocalStorage || []
const initialCart = (): ICartItem[] => {
	const localStorageCart = localStorage.getItem('cart');
	return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export type CartState = {
	data: IGuitar[];
	cart: ICartItem[];
};

export const initialState: CartState = {
	data: db,
	cart: initialCart() // Inicializamos con datos de LS || []
};

/**
 * Reducer
 */

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export const cartReducer = (state: CartState = initialState, action: CartActions) => {
	if (action.type === 'add-to-cart') {
		// findIndex regresa el indice del elemento encontrado, si no existe regresa -1
		const itemExist = state.cart.find((guitar) => guitar.id === action.payload.item.id);

		let updatedCart: ICartItem[] = [];

		if (itemExist) {
			// Evitamos se agregren mas elementos repetidos y que no sean mayor a MAX ITEMS = 5
			updatedCart = state.cart.map((itemState) => {
				if (itemState.id === action.payload.item.id && itemState.quantity < MAX_ITEMS) {
					return { ...itemState, quantity: itemState.quantity + 1 };
				} else {
					return itemState;
				}
			});
		} else {
			// Agregamos por primera vez el articulo solicitado
			const newItem: ICartItem = { ...action.payload.item, quantity: 1 };

			updatedCart = [...state.cart, newItem];
		}

		return {
			...state,
			cart: updatedCart
		};
	}

	if (action.type === 'remove-from-cart') {
		return {
			...state,
			cart: state.cart.filter((guitarState) => guitarState.id !== action.payload.id)
		};
	}

	if (action.type === 'decrease-quantity') {
		return {
			...state,
			cart: state.cart.map((itemState) =>
				itemState.id === action.payload.id && itemState.quantity > MIN_ITEMS
					? { ...itemState, quantity: itemState.quantity - 1 }
					: itemState
			)
		};
	}

	if (action.type === 'increase-quantity') {
		return {
			...state,
			cart: state.cart.map((itemState) =>
				itemState.id === action.payload.id && itemState.quantity < MAX_ITEMS
					? { ...itemState, quantity: itemState.quantity + 1 }
					: itemState
			)
		};
	}

	if (action.type === 'clear-cart') {
		return {
			...state,
			cart: []
		};
	}

	return state;
};
