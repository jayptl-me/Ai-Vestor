#!/bin/bash
# Test script for Course and Lesson API endpoints

# Set the base URL for the API
BASE_URL="http://localhost:3001/api"

# Text colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}  TESTING COURSE AND LESSON API ENDPOINTS ${NC}"
echo -e "${YELLOW}=========================================${NC}"

# -----------------------------------------
# COURSE ENDPOINTS
# -----------------------------------------
echo -e "\n${GREEN}TESTING COURSE ENDPOINTS${NC}"

# Create a course
echo -e "\n${GREEN}1. Creating a new course...${NC}"
CREATE_COURSE_RESPONSE=$(curl -s -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Investing",
    "subtitle": "Learn the basics of investing",
    "description": "This course covers the fundamentals of investing for beginners.",
    "author": "John Doe",
    "category": ["Investing", "Finance"],
    "tags": ["stocks", "bonds", "beginner"]
  }')

echo "Response: $CREATE_COURSE_RESPONSE"

# Extract the course ID from the response
COURSE_ID=$(echo $CREATE_COURSE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$COURSE_ID" ]; then
  echo -e "${RED}Failed to get course ID.${NC}"
  # Set a default ID for testing subsequent requests
  COURSE_ID="fallback-course-id"
else
  echo -e "${GREEN}Successfully created course with ID: $COURSE_ID${NC}"
fi

# Create another course for testing filters
echo -e "\n${GREEN}2. Creating another course for testing filters...${NC}"
curl -s -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Stock Trading",
    "subtitle": "Master the stock market",
    "description": "Advanced techniques for stock market traders.",
    "author": "Jane Smith",
    "category": ["Trading", "Finance"],
    "tags": ["stocks", "advanced", "technical-analysis"]
  }'

# Get all courses
echo -e "\n${GREEN}3. Getting all courses...${NC}"
curl -s -X GET "$BASE_URL/courses"

# Get courses with filter and sorting
echo -e "\n${GREEN}4. Getting courses with filtering and sorting...${NC}"
curl -s -X GET "$BASE_URL/courses?category=Finance&tags=stocks&sortBy=title&order=asc"

# Get a specific course by ID
echo -e "\n${GREEN}5. Getting course by ID: $COURSE_ID${NC}"
curl -s -X GET "$BASE_URL/courses/$COURSE_ID"

# Update a course
echo -e "\n${GREEN}6. Updating course: $COURSE_ID${NC}"
curl -s -X PUT "$BASE_URL/courses/$COURSE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Investing - Updated",
    "description": "Updated course description with more comprehensive content.",
    "tags": ["stocks", "bonds", "beginner", "financial-planning"]
  }'

# -----------------------------------------
# LESSON ENDPOINTS
# -----------------------------------------
echo -e "\n${GREEN}TESTING LESSON ENDPOINTS${NC}"

# Create a lesson
echo -e "\n${GREEN}7. Creating a new lesson...${NC}"
CREATE_LESSON_RESPONSE=$(curl -s -X POST "$BASE_URL/lessons" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding Market Basics",
    "description": "Learn about different markets and how they operate.",
    "videoUrl": "https://example.com/videos/market-basics",
    "courseId": "'$COURSE_ID'"
  }')

echo "Response: $CREATE_LESSON_RESPONSE"

# Extract the lesson ID from the response
LESSON_ID=$(echo $CREATE_LESSON_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$LESSON_ID" ]; then
  echo -e "${RED}Failed to get lesson ID.${NC}"
  # Set a default ID for testing subsequent requests
  LESSON_ID="fallback-lesson-id"
else
  echo -e "${GREEN}Successfully created lesson with ID: $LESSON_ID${NC}"
fi

# Create another lesson
echo -e "\n${GREEN}8. Creating another lesson...${NC}"
curl -s -X POST "$BASE_URL/lessons" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Risk Management Strategies",
    "description": "Learn how to manage risk in your investment portfolio.",
    "videoUrl": "https://example.com/videos/risk-management",
    "courseId": "'$COURSE_ID'"
  }'

# Get all lessons
echo -e "\n${GREEN}9. Getting all lessons...${NC}"
curl -s -X GET "$BASE_URL/lessons"

# Get lessons for a specific course with sorting
echo -e "\n${GREEN}10. Getting lessons for course $COURSE_ID with sorting...${NC}"
curl -s -X GET "$BASE_URL/lessons?courseId=$COURSE_ID&sortBy=title&order=asc"

# Get a specific lesson by ID
echo -e "\n${GREEN}11. Getting lesson by ID: $LESSON_ID${NC}"
curl -s -X GET "$BASE_URL/lessons/$LESSON_ID"

# Update a lesson
echo -e "\n${GREEN}12. Updating lesson: $LESSON_ID${NC}"
curl -s -X PUT "$BASE_URL/lessons/$LESSON_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Understanding Market Basics - Updated",
    "description": "Updated lesson with more comprehensive content."
  }'

# -----------------------------------------
# CLEANUP (optional - comment out if you want to keep the test data)
# -----------------------------------------
echo -e "\n${GREEN}CLEANUP${NC}"

# Delete the lesson
echo -e "\n${GREEN}13. Deleting lesson: $LESSON_ID${NC}"
curl -s -X DELETE "$BASE_URL/lessons/$LESSON_ID"

# Delete the course (which will delete all associated lessons)
echo -e "\n${GREEN}14. Deleting course: $COURSE_ID${NC}"
curl -s -X DELETE "$BASE_URL/courses/$COURSE_ID"

echo -e "\n${YELLOW}=========================================${NC}"
echo -e "${YELLOW}       API TESTING COMPLETED              ${NC}"
echo -e "${YELLOW}=========================================${NC}"