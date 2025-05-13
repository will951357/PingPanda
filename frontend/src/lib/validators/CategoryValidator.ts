import * as z from 'zod';

export const CATEGORY_NAME_VALIDATOR = z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters").regex(/^[a-zA-Z0-9-]*$/, "Category name can only contain letters, numbers, and hyphens");

export const CATEGORY_COLOR_VALIDATOR = z.string().min(1, "Category color is required").regex(/^#[0-9A-F]{6}$/i, "Invalid color format. Use hex format");


export const EMOJI_VALIDATOR = z.string().emoji("Invalid Emoji").optional()