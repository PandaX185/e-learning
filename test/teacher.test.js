import db from "../config/db.js";
import server from "../app.js";
import request from "supertest";
import axios from "axios";
import Teacher from "../teacher/model/teacher.js";
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
        expect(ress.statusCode).toBe(201);
        const teacherDB = await Teacher.findOne({ email: teacher.email });
        //check if the teacher data returned
        expect(ress.body.data.result).toMatchObject({
            email: teacherDB.email,
            firstName: teacherDB.firstName,
            lastName: teacherDB.lastName,
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
        let res = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);

        expect(res.statusCode).toBe(400);
    });

    it("should return statusCode with 400 if there validation error", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doeexample.com",
            password: "password123",
        };
        const res = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);
        expect(res.statusCode).toBe(400);
    });
});

describe("sgin a teacher", () => {
    it("should return statusCode with 200 and user", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };
        await Teacher.create(teacher);

        const res = await request(server)
            .post("/api/teacher/login")
            .send({ email: "john.doe@example.com", password: "password@123" });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.user).toMatchObject({
            email: teacher.email,
        });
    });

    it("should return statusCode with 401 if email or password wrong", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };
        await Teacher.create(teacher);

        const res = await request(server)
            .post("/api/teacher/login")
            .send({ email: "bebbb.doe@example.com", password: "password@123" });

        expect(res.statusCode).toBe(401);
    });
});
