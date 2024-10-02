import supertest from 'supertest';
import { createServer } from '../utils/server';
import Student from '../student/model/student';
import mongoose from 'mongoose';
import connection from '../config/db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const app = createServer();


describe('Student Operations', () => {

    beforeAll(async () => {
        if (connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await Student.deleteMany();
    })

    describe('Student Signup Endpoint', () => {

        it('should create a new student', async () => {
            const mockStudent = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Ppassword123@',
                grade: 10,
                teacherId: '60f1b0b3e1b3b40015f1f2b3',
            };

            const response = await supertest(app)
                .post('/api/students/signup')
                .send(mockStudent)
                .expect(201);

            expect(response.body).toHaveProperty('data');

            const createdStudent = await Student.findOne({ email: mockStudent.email });
            expect(createdStudent).toBeTruthy();
            expect(createdStudent.firstName).toBe(mockStudent.firstName);
            expect(createdStudent.lastName).toBe(mockStudent.lastName);
            expect(createdStudent.email).toBe(mockStudent.email);
            expect(createdStudent.grade).toBe(mockStudent.grade);

            await Student.deleteOne({ email: mockStudent.email, teachers: { $in: [mockStudent.teacherId] } });
        });

        it('should sing up the same student for another teacher', async () => {
            const mockStudent = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Ppassword123@',
                grade: 10,
                teacherId: '60f1b0b3e1b3b40015f1f2b4',
            };

            const response = await supertest(app)
                .post('/api/students/signup')
                .send(mockStudent)
                .expect(201);

            expect(response.body).toHaveProperty('data');

            const createdStudent = await Student.findOne({ email: mockStudent.email });
            expect(createdStudent).toBeTruthy();
            expect(createdStudent.firstName).toBe(mockStudent.firstName);
            expect(createdStudent.lastName).toBe(mockStudent.lastName);
            expect(createdStudent.email).toBe(mockStudent.email);
            expect(createdStudent.grade).toBe(mockStudent.grade);

            await Student.deleteOne({ email: mockStudent.email, teachers: { $in: [mockStudent.teacherId] } });
        });

        it('should return 400 if required fields are missing', async () => {
            const mockStudent = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'Ppassword123@',
                teacherId: '60f1b0b3e1b3b40015f1f2b3',
            };

            await supertest(app)
                .post('/api/students/signup')
                .send(mockStudent)
                .expect(400);
        });

        it('should return 409 if email is already registered', async () => {
            const existingStudent = new Student({
                firstName: 'John',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                hashedPassword: 'Ppassword123@',
                grade: 10,
                teachers: ['60f1b0b3e1b3b40015f1f2b3'],
            });
            await Student.create(existingStudent);

            const mockStudent = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                password: 'Ppassword123@',
                grade: 10,
                teacherId: '60f1b0b3e1b3b40015f1f2b3',
            };

            await supertest(app)
                .post('/api/students/signup')
                .send(mockStudent)
                .expect(409);

            await Student.deleteOne({ email: existingStudent.email });
        });
    });

    describe("Student Login", () => {
        // it("should return status code 200 and the student data on successful login", async () => {
        //     const student = {
        //         firstName: 'John',
        //         lastName: 'Doe',
        //         email: 'john.doe@example.com',
        //         grade: 10,
        //         teachers: ['60f1b0b3e1b3b40015f1f2b3'],
        //         hashedPassword: await bcrypt.hash("password@123", 8),
        //     };
        //     await Student.create(student);

        //     const response = await supertest(app)
        //         .post("/api/students/login/60f1b0b3e1b3b40015f1f2b3")
        //         .send({ email: "john.doe@example.com", password: "password@123" });


        //     expect(response.statusCode).toBe(200);
        //     expect(response.body.data.user).toMatchObject({
        //         email: student.email,
        //     });
        // });

        it("should return status code 401 if email or password is incorrect", async () => {
            const student = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                grade: 10,
                teachers: ['60f1b0b3e1b3b40015f1f2b3'],
                hashedPassword: await bcrypt.hash("password@123", 8),
            };
            await Student.create(student);

            const response = await supertest(app)
                .post("/api/students/login/60f1b0b3e1b3b40015f1f2b3")
                .send({ email: "wrong.email@example.com", password: "password@123" });


            expect(response.statusCode).toBe(401);
        });

        describe("Student forgot password", () => {
            it("should return status code 200 and a message if the email is valid", async () => {
                const student = {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@gmail.com',
                    grade: 10,
                    teachers: ['60f1b0b3e1b3b40015f1f2b3'],
                    hashedPassword: await bcrypt.hash("password@123", 8),
                };
                await Student.create(student);

                const response = await supertest(app)
                    .post("/api/students/forgot-password")
                    .send({ email: student.email });

                expect(response.statusCode).toBe(200);
                expect(response.body.data.message).toBe("OTP sent to your email. It is valid for 3 minutes");
            });

            it("should return status code 404 if the email is not registered", async () => {
                const response = await supertest(app)
                    .post("/api/students/forgot-password")
                    .send({ email: "john.doe@gmail.com" })

                expect(response.statusCode).toBe(404);
                expect(response.body.error).toBe("Student not registered");
            });
        });
    });
})