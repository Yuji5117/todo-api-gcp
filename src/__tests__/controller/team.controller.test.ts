import { getAllTeamController } from "../../controller/team.controller";
import { AppError } from "../../utils/AppError";

describe("getAllTeamController", () => {
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as any;

  it("should throw AppError if userId is missing", () => {
    const reqWithoutUserId = {} as any;

    expect(getAllTeamController(reqWithoutUserId, mockRes)).rejects.toThrow(
      new AppError("userId is required.", 400)
    );
  });
});
