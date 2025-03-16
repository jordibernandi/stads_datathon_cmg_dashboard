import { GraphDataType } from "./GraphDataType";
import { StatsInputData } from "./StatsInputData";

export interface LlmInputData extends StatsInputData {
    data: GraphDataType;
}
