import { CreateEventDto } from "./create-event.dto";
import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class UpdateEventDto extends PartialType(CreateEventDto) {
}
