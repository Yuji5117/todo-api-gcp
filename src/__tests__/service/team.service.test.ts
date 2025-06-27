import { describe } from "node:test";
import { getAllTeams } from "../../service/team.service";

describe("getAllTeam", () => {
  it("should throw if userId is not provided", async () => {
    const mockPrisma = {} as any;

    await expect(getAllTeams(mockPrisma, null as any)).rejects.toThrow(
      "userId is required."
    );
  });
  it("should throw if userId is an empty string", async () => {
    const mockPrisma = {} as any;

    await expect(getAllTeams(mockPrisma, "")).rejects.toThrow(
      "userId is required."
    );
  });

  it("should return teams for the user", async () => {
    const mockPrisma = {
      team: {
        findMany: jest.fn().mockResolvedValue([{ id: 1, name: "Team A" }]),
      },
    } as any;

    const result = await getAllTeams(mockPrisma, "123");

    console.log("mockPrisma", mockPrisma.team.findMany.mock.calls);

    expect(result).toEqual([{ id: 1, name: "Team A" }]);
    expect(mockPrisma.team.findMany).toHaveBeenCalledWith({
      where: { TeamMembers: { some: { userId: 123 } } },
      include: { TeamMembers: true },
    });
  });

  it("should return empty array if no teams found", async () => {
    const mockPrisma = {
      team: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const result = await getAllTeams(mockPrisma as any, "123");
    expect(result).toEqual([]);
  });

  it("should throw if prisma.team.findMany fails", async () => {
    const mockPrisma = {
      team: {
        findMany: jest.fn().mockRejectedValue(new Error("DB Error")),
      },
    } as any;

    await expect(getAllTeams(mockPrisma, "123")).rejects.toThrow("DB Error");
  });
});
