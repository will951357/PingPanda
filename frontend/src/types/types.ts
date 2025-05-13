import { CATEGORY_COLOR_VALIDATOR, CATEGORY_NAME_VALIDATOR, EMOJI_VALIDATOR } from "@/lib/validators/CategoryValidator"
import { z } from "zod"

export type Categories = {
    id?: string,
    name: string,
    emoji?: string,
    color?: number,
    updatedAt?: Date,
    createdAt: Date,
    uniqueFieldsCount?: number,
    eventsCount?: number,
    lastPing?: Date
}

export type baseCategory = {
    name: string,
    color: string,
    emoji: string | undefined
}


export const EVENT_CATEGORY_VALIDATION = z.object({
    name: CATEGORY_NAME_VALIDATOR,
    color: CATEGORY_COLOR_VALIDATOR,
    emoji: EMOJI_VALIDATOR
})

export type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATION>

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  emoji: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    events: number;
  };
}

export type Event = {
  id: string;
  name: string;
  formatedMessage: string;
  userId: string;
  fields: Record<string, any>;
  deliveryStatus: "PENDING" | "SENT" | "FAILED"; // ou o enum real
  createdAt: Date;
  updatedAt: Date;
  eventCategoryId?: string | null;
  category?: {
    id: string;
    name: string;
    color: string;
    emoji: string;
  } | null;
};

export type EventsByCategoryName = {
  events: Event[];
  eventsCount: number;
  uniqueFieldsCount: number;
}

export type UserQuota = {
  categoriesUsed: number;
  categoriesLimit: number;
  eventsUsed: number;
  eventsLimit: number;
  resetDate: Date
}