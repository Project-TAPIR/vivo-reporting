=begin
--------------------------------------------------------------------------------

Stop the Vitro application, delete all MySQL tables from the Vitro database, and
start the application again.

--------------------------------------------------------------------------------

Parameters:
  tomcat_stop_command
    A "shell" command that will stop the Tomcat server.
  tomcat_stop_delay
    Number of seconds to wait after the tomcat_stop_command returns before
    proceeding.
  tomcat_start_command
    A "shell" command that will start the Tomcat server.
  tomcat_start_delay
    Number of seconds to wait after the tomcat_start_command returns before
    proceeding.
  mysql_username
    A user account that has authority to drop the Vitro database in MySQL.
  mysql_password
    The password for mysql_username.
  database_name
    The name of the Vitro database in MySQL.

--------------------------------------------------------------------------------
=end
require 'open-uri'
require File.expand_path('property_file_reader', File.dirname(File.expand_path(__FILE__)))

class DatabaseCleanser
  # ------------------------------------------------------------------------------------
  private
  # ------------------------------------------------------------------------------------
  #
  # Confirm that the parameters are reasonable.
  #
  def sanity_checks_on_parameters()
    # Check that all necessary properties are here.
    raise("Properties file must contain a value for 'tomcat_stop_command'") if @tomcat_stop_command == nil
    raise("Properties file must contain a value for 'tomcat_stop_delay'") if @tomcat_stop_delay == nil
    raise("Properties file must contain a value for 'tomcat_start_command'") if @tomcat_start_command == nil
    raise("Properties file must contain a value for 'tomcat_start_delay'") if @tomcat_start_delay == nil
    raise("Properties file must contain a value for 'website_url'") if @website_url == nil
    raise("Properties file must contain a value for 'mysql_username'") if @mysql_username == nil
    raise("Properties file must contain a value for 'mysql_password'") if @mysql_password == nil
    raise("Properties file must contain a value for 'database_name'") if @database_name == nil

    # Check that we can connect to the MySQL database.
    args = []
    args << "--user=#{@mysql_username}"
    args << "--password=#{@mysql_password}"
    args << "--database=#{@database_name}"
    args << "--execute=show databases;"
    result = system("mysql", *args)
    raise("Can't find the 'mysql' command!") if result == nil
    raise("Can't connect to MySQL database.") if !result
    raise("Error connecting to MySQL database.") if $?.exitstatus != 0
  end

  # Issue the Tomcat stop command and pause for it to take effect.
  #
  def stop_the_webapp()
    puts "   Stopping the webapp..."
    system(@tomcat_stop_command)
    puts "   Waiting #{@tomcat_stop_delay} seconds..."
    sleep(@tomcat_stop_delay)
    puts "   ... stopped."
  end

  # Issue the Tomcat start command, pause for it to take effect, and wait
  # until the server responds to an HTTP request.
  #
  def start_the_webapp()
    puts "   Starting the webapp..."
    system(@tomcat_start_command)
    puts "   Waiting #{@tomcat_start_delay} seconds..."
    sleep(@tomcat_start_delay)
    begin
    open(@website_url){|f|}
    rescue Timeout::Error
      puts ">>> HTTP request timed out!"
      raise
    end
    puts "   ... started."
  end

  # Tell MySQL to drop the database and re-create it.
  #
  def drop_database_and_create_again()
    args = []
    args << "--user=#{@mysql_username}"
    args << "--password=#{@mysql_password}"
    args << "--database=#{@database_name}"
    args << "--execute=drop database #{@database_name}; create database #{@database_name} character set utf8;"
    result = system("mysql", *args)
    raise("Can't find the 'mysql' command!") if result == nil
    raise("Can't clean the MySQL database: command was 'mysql' #{args}") if !result
    raise("Error code from MySQL: #{$?.exitstatus}, command was 'mysql' #{args}") if $?.exitstatus != 0
  end

  # ------------------------------------------------------------------------------------
  public
  # ------------------------------------------------------------------------------------

  # Get the parameters and check them
  #
  def initialize(properties)
    @tomcat_stop_command = properties['tomcat_stop_command']
    @tomcat_stop_delay = properties['tomcat_stop_delay'].to_i
    @tomcat_start_command = properties['tomcat_start_command']
    @tomcat_start_delay = properties['tomcat_start_delay'].to_i
    @website_url = properties['website_url']
    @mysql_username = properties['mysql_username']
    @mysql_password = properties['mysql_password']
    @database_name = properties['database_name']

    sanity_checks_on_parameters()
  end

  # Cleanse the database.
  #
  def cleanse()
    stop_the_webapp()
    drop_database_and_create_again()
    start_the_webapp()
  end
end

#
#
# ------------------------------------------------------------------------------------
# Standalone calling.
#
# Do this if this program was called from the command line. That is, if the command
# expands to the path of this file.
# ------------------------------------------------------------------------------------
#

if File.expand_path($0) == File.expand_path(__FILE__)
  if ARGV.length == 0
    raise("No arguments - usage is: ruby database_cleanser.rb <properties_file>")
  end
  if !File.file?(ARGV[0])
    raise "File does not exist: '#{ARGV[0]}'."
  end

  properties = PropertyFileReader.read(ARGV[0])

  dc = DatabaseCleanser.new(properties)
  dc.cleanse()
end