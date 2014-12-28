# coding: utf-8

require 'rack'
require 'singleton'
require 'jiji/composing/container_factory'

module Jiji
module Web
  
  class WebApplication
    
    include Singleton
    
    def initialize
      @container = Jiji::Composing::ContainerFactory.instance.new_container
      setup
    end
    
    def setup
      @application = @container.lookup(:application)
      @application.setup
    end
    
    def tear_down
      @application.tear_down
    end
    
    def build
      return Rack::Builder.new do
        map( "/api/echo" ) { run EchoService }
        
        map( "/api/authenticator" ) { run AuthenticationService }
        
        map( "/api/setting/initialization" ) { run InitialSettingService }
        map( "/api/setting/rmt-broker" )     { run RMTBrokerSettingService }
        map( "/api/setting/security" )       { run SecuritySettingService  }
      end
    end
    
    attr_reader :container
  end

end
end