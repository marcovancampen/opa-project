# Photo Archive Backend

Spring Boot REST API for managing photo archives with person and date-based search capabilities.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Running the Application

1. **Build the project:**
```bash
mvn clean install
```

2. **Run the application:**
```bash
mvn spring-boot:run
```

The API will start on `http://localhost:8080`

### H2 Database Console
Access the H2 database console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:photoarchive`
- Username: `sa`
- Password: (leave empty)

## 📡 API Endpoints

### 1. Find Photos by Person
```http
GET /api/photos/by-person?name={personName}
```

**Example:**
```bash
curl "http://localhost:8080/api/photos/by-person?name=Riek%20Wanders"
```

### 2. Find Photos by Date Range
```http
GET /api/photos/by-date-range?start={startDate}&end={endDate}
```

**Example:**
```bash
curl "http://localhost:8080/api/photos/by-date-range?start=1990-01-01&end=2000-12-31"
```

### 3. Find Photos by Event Type
```http
GET /api/photos/by-event?keyword={eventKeyword}
```

**Example:**
```bash
curl "http://localhost:8080/api/photos/by-event?keyword=Sinterklaas"
```

### Additional Endpoints

**Get all photos:**
```http
GET /api/photos
```

**Get photo by volgnr:**
```http
GET /api/photos/{volgnr}
```

## 📊 Database Schema

### Tables

#### `photos`
- `photo_id` (Primary Key)
- `volgnr` (Unique, indexed)
- `onderwerp` (Text)
- `date_start` (Date, indexed)
- `date_end` (Date, indexed)
- `year_only` (Integer)

#### `people`
- `person_id` (Primary Key)
- `full_name` (VARCHAR 500)
- `primary_name` (VARCHAR 200, indexed)
- `searchable_names` (Text)

#### `photo_people` (Junction Table)
- `photo_id` (Foreign Key → photos)
- `person_id` (Foreign Key → people)

## 🛠️ Technology Stack

- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (development)
- **PostgreSQL** (production-ready)
- **Lombok**
- **Maven**

## 📝 Configuration

Edit `src/main/resources/application.properties` to change:
- Server port
- Database configuration
- Logging levels

### Switching to PostgreSQL

Uncomment the PostgreSQL configuration in `application.properties` and update credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/photoarchive
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## 📦 Project Structure

```
photo-archive-backend/
├── src/main/java/com/photoarchive/
│   ├── PhotoArchiveApplication.java
│   ├── entity/
│   │   ├── Photo.java
│   │   └── Person.java
│   ├── repository/
│   │   ├── PhotoRepository.java
│   │   └── PersonRepository.java
│   ├── service/
│   │   └── PhotoService.java
│   ├── controller/
│   │   └── PhotoController.java
│   └── dto/
│       ├── PhotoDTO.java
│       └── PersonDTO.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🧪 Testing

Run tests with:
```bash
mvn test
```

## 📄 License

This project is created for managing the Opa photo archive.
