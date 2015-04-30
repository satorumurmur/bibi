# -- coding: utf-8 --

require 'sprockets'
require 'sprockets-sass'
require 'compass'

environment = Sprockets::Environment.new

map '/dev-bib/i/res/styles' do
  environment.append_path 'dev-bib/i/res/styles'
  run environment
end

map '/dev-bib/i/res/images' do
  environment.append_path 'bib/i/res/images'
  run environment
end

map '/dev-bib/i/res/fonts' do
  environment.append_path 'bib/i/res/fonts'
  run environment
end

map '/' do
  run Rack::File.new('.')
end