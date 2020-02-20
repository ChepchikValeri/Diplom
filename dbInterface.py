#!/usr/bin/python
import mysql.connector
from mysql.connector import errorcode
import random
import datetime
def insertData(id_measurements, nanometers, voltage, position):
    try:
        cnx =  mysql.connector.connect(host="localhost", user="user", password="root", database="db")        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            return("Username or password wrong!")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            return("No such Database")
        else:
            return(err)
    else:
        cur = cnx.cursor()   


        # Use all the SQL you like

        measurement = random.randint(1,10)
        insert_stmt = ("INSERT INTO data (id_measurements, created, nanometers, voltage, position) "
        "VALUES (%s, %s, %s, %s, %s)")
        dateNow = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data = (id_measurements, dateNow, nanometers, voltage, position)
        cur.execute(insert_stmt, data)
        cnx.commit()
        cnx.close()
        return 0

def insertUser(username, password, isAdmin):
    try:
        cnx =  mysql.connector.connect(host="localhost", user="user", password="root", database="db")        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            return("Username or password wrong!")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            return("No such Database")
        else:
            return(err)
    else:
        cur = cnx.cursor() 
        insert_stmt = ("INSERT INTO users (username, password, isAdmin) " 
        "VALUES (%s, %s, %s)")
        data = (username, password, isAdmin)
        cur.execute(insert_stmt,data)
        cnx.commit()
        cnx.close()
        return 0

def insertSample(description):
    try:
        cnx =  mysql.connector.connect(host="localhost", user="user", password="root", database="db")        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            return("Username or password wrong!")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            return("No such Database")
        else:
            return(err)
    else:
        cur = cnx.cursor() 
        insert_stmt = ("INSERT INTO sample (description) " 
        "VALUES (%s)")
        data = (description,)
        cur.execute(insert_stmt,data)
        cnx.commit()
        cnx.close()
        return 0

def insertMeasurement(id_sample, id_owner):
    try:
        cnx =  mysql.connector.connect(host="localhost", user="user", password="root", database="db")        
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            return("Username or password wrong!")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            return("No such Database")
        else:
            return(err)
    else:
        cur = cnx.cursor() 
        insert_stmt = ("INSERT INTO measurements (created, id_sample, id_owner) " 
        "VALUES (%s, %s, %s)")
        dateNow = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data = (dateNow, id_sample, id_owner)
        cur.execute(insert_stmt,data)
        cnx.commit()
        cnx.close()
        return 0