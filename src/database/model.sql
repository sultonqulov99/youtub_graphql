drop database if exists youtube;
create database youtube;

create table users(
    user_id serial primary key,
    username varchar(20) not null unique,
    password varchar(80) not null,
    profile_img varchar(150) 
);
insert into users(username,password,profile_img) values
('ali',123456,'ali.jpg'),
('alisher',123456,'alisher.jpg');


create table videos (
    video_id serial primary key,
    user_id int references users(user_id) not null,
    video_name varchar(60) not null,
    view_file varchar(256) not null,
    create_time varchar(120) not null,
    create_date varchar(120) not null,
    download_link varchar(256) not null,
    size float not null
);


insert into videos(user_id,video_name,view_file,create_time,create_date,download_link,size) values
(1,'postman','http://localhost:4000/postman.video','06:30','2022-05-21','postman.video',5),
(3,'yaxshi','http://localhost:4000/yaxshi.video','09:30','2022-05-21','postman.video',10),
(1,'narmanli','http://localhost:4000/postman.video','09:40','2022-05-21','postman.video',2);
