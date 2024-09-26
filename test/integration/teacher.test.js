import db from "./../../config/db.js";
import server from "./../../app.js";
import request from "supertest";
import superagent from "superagent";
import Teacher from "../../teacher/model/teacher.js";
beforeEach(async () => {
    await Teacher.deleteMany();
});

afterAll(async () => {
    await server.close();
    await db.close();
});

describe("sginup a teacher", () => {
    it("should return status code with 200 and the teacher data", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };
        const ress = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);

        //check if the statusCode right
        expect(ress.statusCode).toBe(200);

        //check if the teacher data returned
        expect(ress.body.data.result).toMatchObject({
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
        });
    });

    it("should return statusCode with 400 if teacher are exist", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };
        await Teacher.create(teacher);
        const ress = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);
        console.log(ress);
        expect(ress.body.message).toBe("Teacher already exists");
        expect(ress.statusCode).toBe(400);
        //console.log(ress);
    });
});
