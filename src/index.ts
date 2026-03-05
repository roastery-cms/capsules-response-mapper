import { barista } from "@roastery/barista";
import { Entity, Mapper } from "@roastery/beans";
import type { ElysiaCustomStatusResponse } from "elysia";

type ResponseValue = { constructor: { name: string }; code: number };

export const baristaResponseMapper = barista().onAfterHandle(
	{ as: "global" },
	({ responseValue, status }) => {
		if (typeof responseValue !== "object") return;

		const response =
			"constructor" in (responseValue as ResponseValue) &&
			(responseValue as ResponseValue).constructor.name ===
				"ElysiaCustomStatusResponse"
				? (responseValue as ElysiaCustomStatusResponse<number, unknown>)
						.response
				: responseValue;

		if (response instanceof Entity)
			return status(
				(responseValue as ResponseValue).code,
				Mapper.toDTO(response),
			);
		if (
			Array.isArray(response) &&
			response.length > 0 &&
			response[0] instanceof Entity
		)
			return status(
				(responseValue as ResponseValue).code,
				response.map((item) => Mapper.toDTO(item)),
			);
	},
);
