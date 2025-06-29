import { describe } from "node:test";
import { addTeamMember, getAllTeams } from "../../service/team.service";

describe("getAllTeam", () => {
  it("should return teams for the user", async () => {
    const mockPrisma = {
      team: {
        findMany: jest.fn().mockResolvedValue([{ id: 1, name: "Team A" }]),
      },
    } as any;

    const result = await getAllTeams(mockPrisma, "123");

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

describe("addTeamMemberController", () => {
  const mockPrisma = {
    teamMember: {
      findUnique: jest.fn(),
    },
  } as any;

  it("throw error if user is already a member", async () => {
    mockPrisma.teamMember.findUnique.mockResolvedValue({
      id: 1,
    });

    await expect(addTeamMember(mockPrisma, 1, 1)).rejects.toThrow(
      "This user is already a member of the team."
    );

    expect(mockPrisma.teamMember.findUnique).toHaveBeenCalledWith({
      where: {
        userId_teamId: {
          teamId: 1,
          userId: 1,
        },
      },
    });
  });

  // throw error if user doesnt exist
  it("throw error if user doesn't exist", async () => {});
  // throw error if team doesnt exsit
  it("throw error if team doesn't exsit", async () => {});
});
