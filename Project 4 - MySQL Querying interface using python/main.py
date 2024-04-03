import tkinter as tk
from tkinter import scrolledtext
from pygments.lexers import get_lexer_by_name
from pygments.formatters import TkinterFormatter
from tkinter import messagebox
import mysql.connector

def highlight_sql(event=None):
    lexer = get_lexer_by_name("sql")
    formatter = TkinterFormatter()
    highlighted_sql = pygments.highlight(sql_text.get("1.0", "end-1c"), lexer, formatter)
    highlighted_text.delete("1.0", "end")
    highlighted_text.insert("1.0", highlighted_sql)

def execute_sql():
    query = sql_text.get("1.0", "end-1c")
    cursor.execute(query)
    result = cursor.fetchall()
    result_str = '\n'.join(map(str, result))
    messagebox.showinfo("SQL Query Result", result_str)
    # Do something with the result, e.g., display it in a messagebox or another widget

# Create the GUI
root = tk.Tk()
root.title("SQL Editor")

# Input fields for MySQL connection details
host_label = tk.Label(root, text="Host:")
host_label.pack()
host_entry = tk.Entry(root)
host_entry.pack()

user_label = tk.Label(root, text="User:")
user_label.pack()
user_entry = tk.Entry(root)
user_entry.pack()

password_label = tk.Label(root, text="Password:")
password_label.pack()
password_entry = tk.Entry(root, show="*")
password_entry.pack()

database_label = tk.Label(root, text="Database:")
database_label.pack()
database_entry = tk.Entry(root)
database_entry.pack()

# Button to establish connection
def connect_to_database():
    global conn, cursor
    conn = mysql.connector.connect(
        host=host_entry.get(),
        user=user_entry.get(),
        password=password_entry.get(),
        database=database_entry.get()
    )
    cursor = conn.cursor()

connect_button = tk.Button(root, text="Connect to Database", command=connect_to_database)
connect_button.pack()

sql_text = scrolledtext.ScrolledText(root, wrap=tk.WORD, width=80, height=20)
sql_text.pack(expand=True, fill="both")
sql_text.bind("<KeyRelease>", highlight_sql)

highlighted_text = scrolledtext.ScrolledText(root, wrap=tk.WORD, width=80, height=20)
highlighted_text.pack(expand=True, fill="both")

execute_button = tk.Button(root, text="Execute SQL", command=execute_sql)
execute_button.pack()

root.mainloop()

# Close cursor and connection
cursor.close()
conn.close()
