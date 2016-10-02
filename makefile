default:
	echo 'default...'

publish:
	grunt release
	git push origin master && git push origin --tags
	npm publish
