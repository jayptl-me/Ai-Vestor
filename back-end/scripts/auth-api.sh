#!/bin/bash

# Setup variables
BASE_URL="http://localhost:3000/api"
TOKEN=""
USER_ID=""
COURSE_ID=""
LESSON_ID=""

# Function to check response status with an expected status code
check_response() {
  local status=$1
  local message=$2
  local expected=$3
  if [ "$status" -eq "$expected" ]; then
    echo "Success: $message"
  else
    echo "Failed: $message with status $status, expected $expected"
    exit 1
  fi
}

# Register a new user
echo "Registering a new user..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpassword"}')
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
check_response "$REGISTER_STATUS" "Register" 201

# Login to get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpassword"}')
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
TOKEN=$(echo "$LOGIN_BODY" | jq -r '.data.token')
USER_ID=$(echo "$LOGIN_BODY" | jq -r '.data.userId')
check_response "$LOGIN_STATUS" "Login" 200
echo "Token: $TOKEN"
echo "User ID: $USER_ID"

# Get user progress
echo "Getting user progress..."
PROGRESS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/progress" \
  -H "Cookie: token=$TOKEN")
PROGRESS_BODY=$(echo "$PROGRESS_RESPONSE" | sed '$d')
PROGRESS_STATUS=$(echo "$PROGRESS_RESPONSE" | tail -n 1)
check_response "$PROGRESS_STATUS" "Get Progress" 200
echo "Progress: $PROGRESS_BODY"

# Create a course
echo "Creating a course..."
COURSE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=$TOKEN" \
  -d '{"title": "Test Course", "subtitle": "Test Subtitle", "description": "Test Description", "author": "Test Author", "category": ["Test"], "tags": ["Test"]}')
COURSE_BODY=$(echo "$COURSE_RESPONSE" | sed '$d')
COURSE_STATUS=$(echo "$COURSE_RESPONSE" | tail -n 1)
COURSE_ID=$(echo "$COURSE_BODY" | jq -r '.data.id')
check_response "$COURSE_STATUS" "Create Course" 201
echo "Course ID: $COURSE_ID"

# Create a video lesson
echo "Creating a video lesson..."
VIDEO_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/lessons" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=$TOKEN" \
  -d "{\"title\": \"Test Video Lesson\", \"description\": \"Test Description\", \"type\": \"VIDEO\", \"videoUrl\": \"https://www.youtube.com/embed/test\", \"courseId\": \"$COURSE_ID\"}")
VIDEO_LESSON_BODY=$(echo "$VIDEO_LESSON_RESPONSE" | sed '$d')
VIDEO_LESSON_STATUS=$(echo "$VIDEO_LESSON_RESPONSE" | tail -n 1)
LESSON_ID=$(echo "$VIDEO_LESSON_BODY" | jq -r '.data.id')
check_response "$VIDEO_LESSON_STATUS" "Create Video Lesson" 201
echo "Video Lesson ID: $LESSON_ID"

# Create a quiz lesson
echo "Creating a quiz lesson..."
QUIZ_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/lessons" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=$TOKEN" \
  -d "{\"title\": \"Test Quiz Lesson\", \"description\": \"Test Description\", \"type\": \"QUIZ\", \"quizQuestions\": [{\"question\": \"What is 2+2?\", \"options\": [\"3\", \"4\"], \"correctAnswer\": \"4\"}], \"courseId\": \"$COURSE_ID\"}")
QUIZ_LESSON_BODY=$(echo "$QUIZ_LESSON_RESPONSE" | sed '$d')
QUIZ_LESSON_STATUS=$(echo "$QUIZ_LESSON_RESPONSE" | tail -n 1)
check_response "$QUIZ_LESSON_STATUS" "Create Quiz Lesson" 201

# Get all lessons
echo "Getting all lessons..."
LESSONS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/lessons" \
  -H "Cookie: token=$TOKEN")
LESSONS_BODY=$(echo "$LESSONS_RESPONSE" | sed '$d')
LESSONS_STATUS=$(echo "$LESSONS_RESPONSE" | tail -n 1)
check_response "$LESSONS_STATUS" "Get Lessons" 200
echo "Lessons: $LESSONS_BODY"

# Get a specific lesson
echo "Getting a specific lesson..."
SPECIFIC_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/lessons/$LESSON_ID" \
  -H "Cookie: token=$TOKEN")
SPECIFIC_LESSON_BODY=$(echo "$SPECIFIC_LESSON_RESPONSE" | sed '$d')
SPECIFIC_LESSON_STATUS=$(echo "$SPECIFIC_LESSON_RESPONSE" | tail -n 1)
check_response "$SPECIFIC_LESSON_STATUS" "Get Specific Lesson" 200
echo "Specific Lesson: $SPECIFIC_LESSON_BODY"

# Update a lesson
echo "Updating a lesson..."
UPDATE_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/lessons/$LESSON_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: token=$TOKEN" \
  -d '{"title": "Updated Test Video Lesson"}')
UPDATE_LESSON_BODY=$(echo "$UPDATE_LESSON_RESPONSE" | sed '$d')
UPDATE_LESSON_STATUS=$(echo "$UPDATE_LESSON_RESPONSE" | tail -n 1)
check_response "$UPDATE_LESSON_STATUS" "Update Lesson" 200
echo "Updated Lesson: $UPDATE_LESSON_BODY"

# Mark a lesson as completed
echo "Marking a lesson as completed..."
COMPLETE_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/lessons/$LESSON_ID/complete" \
  -H "Cookie: token=$TOKEN")
COMPLETE_LESSON_BODY=$(echo "$COMPLETE_LESSON_RESPONSE" | sed '$d')
COMPLETE_LESSON_STATUS=$(echo "$COMPLETE_LESSON_RESPONSE" | tail -n 1)
check_response "$COMPLETE_LESSON_STATUS" "Complete Lesson" 200
echo "Complete Lesson Response: $COMPLETE_LESSON_BODY"

# Get user progress after completing a lesson
echo "Getting user progress after completing a lesson..."
PROGRESS_AFTER_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/progress" \
  -H "Cookie: token=$TOKEN")
PROGRESS_AFTER_LESSON_BODY=$(echo "$PROGRESS_AFTER_LESSON_RESPONSE" | sed '$d')
PROGRESS_AFTER_LESSON_STATUS=$(echo "$PROGRESS_AFTER_LESSON_RESPONSE" | tail -n 1)
check_response "$PROGRESS_AFTER_LESSON_STATUS" "Get Progress After Lesson" 200
echo "Progress After Lesson: $PROGRESS_AFTER_LESSON_BODY"

# Mark a course as completed
echo "Marking a course as completed..."
COMPLETE_COURSE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/courses/$COURSE_ID/complete" \
  -H "Cookie: token=$TOKEN")
COMPLETE_COURSE_BODY=$(echo "$COMPLETE_COURSE_RESPONSE" | sed '$d')
COMPLETE_COURSE_STATUS=$(echo "$COMPLETE_COURSE_RESPONSE" | tail -n 1)
check_response "$COMPLETE_COURSE_STATUS" "Complete Course" 200
echo "Complete Course Response: $COMPLETE_COURSE_BODY"

# Get user progress after completing a course
echo "Getting user progress after completing a course..."
PROGRESS_AFTER_COURSE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/progress" \
  -H "Cookie: token=$TOKEN")
PROGRESS_AFTER_COURSE_BODY=$(echo "$PROGRESS_AFTER_COURSE_RESPONSE" | sed '$d')
PROGRESS_AFTER_COURSE_STATUS=$(echo "$PROGRESS_AFTER_COURSE_RESPONSE" | tail -n 1)
check_response "$PROGRESS_AFTER_COURSE_STATUS" "Get Progress After Course" 200
echo "Progress After Course: $PROGRESS_AFTER_COURSE_BODY"

# Delete a lesson
echo "Deleting a lesson..."
DELETE_LESSON_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/lessons/$LESSON_ID" \
  -H "Cookie: token=$TOKEN")
DELETE_LESSON_BODY=$(echo "$DELETE_LESSON_RESPONSE" | sed '$d')
DELETE_LESSON_STATUS=$(echo "$DELETE_LESSON_RESPONSE" | tail -n 1)
check_response "$DELETE_LESSON_STATUS" "Delete Lesson" 200
echo "Delete Lesson Response: $DELETE_LESSON_BODY"

# Delete a course
echo "Deleting a course..."
DELETE_COURSE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/courses/$COURSE_ID" \
  -H "Cookie: token=$TOKEN")
DELETE_COURSE_BODY=$(echo "$DELETE_COURSE_RESPONSE" | sed '$d')
DELETE_COURSE_STATUS=$(echo "$DELETE_COURSE_RESPONSE" | tail -n 1)
check_response "$DELETE_COURSE_STATUS" "Delete Course" 200
echo "Delete Course Response: $DELETE_COURSE_BODY"

echo "All tests completed successfully!"