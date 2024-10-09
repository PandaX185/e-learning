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
        });

        it('should sign up the same student for another teacher', async () => {
            const mockStudent = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                hashedPassword: await bcrypt.hash('Ppassword123@', 8),
                grade: 10,
                teacherId: '60f1b0b3e1b3b40015f1f2b4',
            };
            await Student.create(mockStudent);

            mockStudent.teacherId = '60f1b0b3e1b3b40015f1f2b3';
            mockStudent.password = 'Ppassword123@'
            const response = await supertest(app)
                .post('/api/students/signup')
                .send(mockStudent)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.firstName).toBe(mockStudent.firstName);
            expect(response.body.data.lastName).toBe(mockStudent.lastName);
            expect(response.body.data.email).toBe(mockStudent.email);
            expect(response.body.data.grade).toBe(mockStudent.grade);
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
                teacherId: '60f1b0b3e1b3b40015f1f2b3',
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
        });
    });

    describe("Student Login", () => {
        it("should return status code 200 and the student data on successful login", async () => {
            const student = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                grade: 10,
                teacherId: '60f1b0b3e1b3b40015f1f2b3',
                hashedPassword: await bcrypt.hash("password@123", 8),
            };
            await Student.create(student);

            const response = await supertest(app)
                .post("/api/students/login")
                .send({ email: "john.doe@example.com", password: "password@123", teacherId: "60f1b0b3e1b3b40015f1f2b3" });


            expect(response.statusCode).toBe(200);
            expect(response.body.data.student).toMatchObject({
                email: student.email,
            });
            expect(response.body.data.accessToken).toBeTruthy();
        });

        it("should return status code 401 if email or password is incorrect", async () => {
            const student = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                grade: 10,
                teacherId: '60f1b0b3e1b3b40015f1f2b3',
                hashedPassword: await bcrypt.hash("password@123", 8),
            };
            await Student.create(student);

            const response = await supertest(app)
                .post("/api/students/login")
                .send({ email: "wrong.email@example.com", password: "password@123", teacherId: "60f1b0b3e1b3b40015f1f2b3" });


            expect(response.statusCode).toBe(401);
        });

        describe("Student forgot password", () => {
            it("should return status code 200 and a message if the email is valid", async () => {
                const student = {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@gmail.com',
                    grade: 10,
                    teacherId: '60f1b0b3e1b3b40015f1f2b3',
                    hashedPassword: await bcrypt.hash("password@123", 8),
                };
                await Student.create(student);

                const response = await supertest(app)
                    .post("/api/students/forgot-password")
                    .send({ email: student.email, teacherId: student.teacherId });

                expect(response.statusCode).toBe(200);
                expect(response.body.data.message).toBe("OTP sent to your email. It is valid for 3 minutes");
            });

            it("should return status code 404 if the email is not registered", async () => {
                const response = await supertest(app)
                    .post("/api/students/forgot-password")
                    .send({ email: "john.doe@gmail.com", teacherId: "60f1b0b3e1b3b40015f1f2b3" });

                expect(response.statusCode).toBe(404);                
                expect(response.body.message).toBe("Student not registered");
            });
        });
    });
})