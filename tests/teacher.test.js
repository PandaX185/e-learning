import db from "../config/db.js";
import server from "../app.js";
import request from "supertest";
import Teacher from "../teacher/model/teacher.js";

beforeAll(async () => {
    await db.connect();
});

beforeEach(async () => {
    await Teacher.deleteMany();
});

afterAll(async () => {
    await server.close();
    await db.close();
});

describe("Teacher Signup", () => {
    it("should return status code 201 and the teacher data on successful signup", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };

        const response = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);


        expect(response.statusCode).toBe(201);

        const teacherDB = await Teacher.findOne({ email: teacher.email });

        expect(teacherDB).not.toBeNull();


        expect(response.body.data.result).toMatchObject({
            email: teacherDB.email,
            firstName: teacherDB.firstName,
            lastName: teacherDB.lastName,
        });
    });

    it("should return status code 400 if the teacher already exists", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };


        await Teacher.create(teacher);

        const response = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);


        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Teacher already exists");
    });

    it("should return status code 400 if there is a validation error", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doeexample.com",
            password: "password123",
        };

        const response = await request(server)
            .post("/api/teachers/signup")
            .send(teacher);


        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invalid email or password format");
    });
});

describe("Teacher Login", () => {
    it("should return status code 200 and the user data on successful login", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };


        await Teacher.create(teacher);

        const response = await request(server)
            .post("/api/teacher/login")
            .send({ email: "john.doe@example.com", password: "password@123" });


        expect(response.statusCode).toBe(200);
        expect(response.body.data.user).toMatchObject({
            email: teacher.email,
        });
    });

    it("should return status code 401 if email or password is incorrect", async () => {
        const teacher = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password@123",
        };


        await Teacher.create(teacher);


        const response = await request(server)
            .post("/api/teacher/login")
            .send({ email: "wrong.email@example.com", password: "password@123" });


        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Invalid email or password");
    });
});
