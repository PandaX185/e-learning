import supertest from 'supertest';
import { createServer } from '../utils/server';
import mongoose from 'mongoose';
import connection from '../config/db';
import bcrypt from 'bcrypt';
import Teacher from "../teacher/model/teacher.js";
import dotenv from 'dotenv';

dotenv.config();

const app = createServer();


describe("Teacher Operations", () => {

    beforeAll(async () => {
        if (connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await Teacher.deleteMany();
    })

    describe("Teacher Signup", () => {
        it("should return status code 201 and the teacher data on successful signup", async () => {
            const teacher = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password@123",
            };

            const response = await supertest(app)
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

        it("should return status code 409 if the teacher already exists", async () => {
            const teacher = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password@123",
            };


            await Teacher.create({ ...teacher, hashedPassword: teacher.password });

            const response = await supertest(app)
                .post("/api/teachers/signup")
                .send(teacher);


            expect(response.statusCode).toBe(409);
            expect(response.body.error).toBe("Teacher already exists");
        });

        it("should return status code 400 if there is a validation error", async () => {
            const teacher = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doeexample.com",
                password: "password123",
            };

            const response = await supertest(app)
                .post("/api/teachers/signup")
                .send(teacher);


            expect(response.statusCode).toBe(400);
        });
    });

    describe("Teacher Login", () => {
        it("should return status code 200 and the user data on successful login", async () => {
            const teacher = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                hashedPassword: await bcrypt.hash("password@123", 8),
            };

            await Teacher.create(teacher);

            const response = await supertest(app)
                .post("/api/teachers/login")
                .send({ email: "john.doe@example.com", password: "password@123" });


            expect(response.statusCode).toBe(200);
            expect(response.body.data.user).toMatchObject({
                email: teacher.email,
            });
        });

        it("should return status code 403 if email or password is incorrect", async () => {
            const teacher = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                hashedPassword: await bcrypt.hash("password@123", 8),
            };

            await Teacher.create(teacher);

            const response = await supertest(app)
                .post("/api/teachers/login")
                .send({ email: "wrong.email@example.com", password: "password@123" });


            expect(response.statusCode).toBe(403);
        });
    });
})
