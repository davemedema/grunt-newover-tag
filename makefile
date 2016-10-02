default:
	echo 'default...'

publish:
	grunt release
	git push origin master
	npm publish
